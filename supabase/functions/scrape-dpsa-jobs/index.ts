import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { DOMParser, Element } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Job {
  title: string;
  department: string;
  location: string;
  closingDate: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting DPSA job scraping...');
    
    // Step 1: Fetch the main vacancy page
    const mainPageUrl = 'https://www.dpsa.gov.za/newsroom/psvc/';
    console.log('Fetching main page:', mainPageUrl);
    
    const mainPageResponse = await fetch(mainPageUrl);
    if (!mainPageResponse.ok) {
      throw new Error(`Failed to fetch main page: ${mainPageResponse.status}`);
    }
    
    const mainPageHtml = await mainPageResponse.text();
    const mainDoc = new DOMParser().parseFromString(mainPageHtml, 'text/html');
    
    if (!mainDoc) {
      throw new Error('Failed to parse main page HTML');
    }
    
    // Step 2: Find the latest circular link
    console.log('Looking for latest circular link...');
    const links = mainDoc.querySelectorAll('a');
    let latestCircularUrl = '';
    let latestCircularText = '';
    
    // Look for links containing "Circular" and a year
    for (const link of links) {
      const text = link.textContent.trim();
      const href = (link as Element).getAttribute('href');
      
      if (text.match(/Circular\s+\d+\s+of\s+\d{4}/i) && href) {
        latestCircularText = text;
        latestCircularUrl = href.startsWith('http') ? href : `https://www.dpsa.gov.za${href}`;
        console.log('Found circular:', latestCircularText, latestCircularUrl);
        break;
      }
    }
    
    if (!latestCircularUrl) {
      throw new Error('Could not find latest circular link');
    }
    
    // Step 3: Fetch the circular page
    console.log('Fetching circular page:', latestCircularUrl);
    const circularResponse = await fetch(latestCircularUrl);
    if (!circularResponse.ok) {
      throw new Error(`Failed to fetch circular page: ${circularResponse.status}`);
    }
    
    const circularHtml = await circularResponse.text();
    const circularDoc = new DOMParser().parseFromString(circularHtml, 'text/html');
    
    if (!circularDoc) {
      throw new Error('Failed to parse circular page HTML');
    }
    
    // Step 4: Find all job tables and extract data
    console.log('Extracting job data from tables...');
    const jobs: Job[] = [];
    const tables = circularDoc.querySelectorAll('table');
    
    console.log(`Found ${tables.length} tables`);
    
    for (const table of tables) {
      const rows = (table as Element).querySelectorAll('tr');
      
      for (let i = 1; i < rows.length; i++) { // Skip header row
        const cells = (rows[i] as Element).querySelectorAll('td, th');
        
        if (cells.length >= 4) {
          const job: Job = {
            title: cells[0]?.textContent.trim() || '',
            department: cells[1]?.textContent.trim() || '',
            location: cells[2]?.textContent.trim() || '',
            closingDate: cells[3]?.textContent.trim() || '',
          };
          
          // Only add if we have at least a title
          if (job.title) {
            jobs.push(job);
          }
        }
      }
    }
    
    console.log(`Extracted ${jobs.length} jobs`);
    
    return new Response(JSON.stringify({
      success: true,
      circular: latestCircularText,
      circularUrl: latestCircularUrl,
      totalJobs: jobs.length,
      jobs: jobs,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Error in scrape-dpsa-jobs function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(JSON.stringify({ 
      success: false,
      error: errorMessage 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
