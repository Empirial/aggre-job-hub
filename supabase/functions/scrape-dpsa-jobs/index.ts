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
  source?: string;
}

interface DepartmentPDF {
  name: string;
  url: string;
}

async function parsePdfText(pdfUrl: string): Promise<string> {
  try {
    // Use pdf.co API to extract text from PDF
    const apiKey = Deno.env.get('PDF_CO_API_KEY') || 'demo';
    
    const response = await fetch('https://api.pdf.co/v1/pdf/convert/to/text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        url: pdfUrl,
        async: false,
      }),
    });
    
    if (!response.ok) {
      console.error(`PDF.co API error for ${pdfUrl}:`, response.status);
      return '';
    }
    
    const data = await response.json();
    
    if (data.url) {
      // Download the extracted text
      const textResponse = await fetch(data.url);
      return await textResponse.text();
    }
    
    return '';
  } catch (error) {
    console.error(`Error parsing PDF ${pdfUrl}:`, error);
    return '';
  }
}

function extractJobsFromText(text: string, departmentName: string): Job[] {
  const jobs: Job[] = [];
  
  // Split text into lines
  const lines = text.split('\n').map(line => line.trim()).filter(line => line);
  
  // Look for common patterns in DPSA job listings
  // Pattern: POST XX/XX: Job Title
  const postPattern = /POST\s+\d+\/\d+\s*:?\s*(.+)/i;
  
  let currentJob: Partial<Job> | null = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if line starts a new job posting
    const postMatch = line.match(postPattern);
    if (postMatch) {
      // Save previous job if exists
      if (currentJob && currentJob.title) {
        jobs.push({
          title: currentJob.title,
          department: currentJob.department || departmentName,
          location: currentJob.location || 'Not specified',
          closingDate: currentJob.closingDate || 'Not specified',
          source: departmentName,
        });
      }
      
      // Start new job
      currentJob = {
        title: postMatch[1].trim(),
        department: departmentName,
      };
      continue;
    }
    
    // Extract location/centre
    if (currentJob && (line.toLowerCase().includes('centre:') || line.toLowerCase().includes('station:'))) {
      const locationMatch = line.match(/(?:centre|station)\s*:?\s*(.+)/i);
      if (locationMatch) {
        currentJob.location = locationMatch[1].trim();
      }
    }
    
    // Extract closing date
    if (currentJob && line.toLowerCase().includes('closing date')) {
      const dateMatch = line.match(/closing\s+date\s*:?\s*(.+)/i);
      if (dateMatch) {
        currentJob.closingDate = dateMatch[1].trim();
      }
    }
  }
  
  // Save last job
  if (currentJob && currentJob.title) {
    jobs.push({
      title: currentJob.title,
      department: currentJob.department || departmentName,
      location: currentJob.location || 'Not specified',
      closingDate: currentJob.closingDate || 'Not specified',
      source: departmentName,
    });
  }
  
  return jobs;
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
    
    // Step 4: Extract PDF links from the circular page
    console.log('Extracting department PDF links...');
    const pdfLinks: DepartmentPDF[] = [];
    const allLinks = circularDoc.querySelectorAll('a');
    
    for (const link of allLinks) {
      const href = (link as Element).getAttribute('href');
      const text = link.textContent.trim();
      
      if (href && href.toLowerCase().endsWith('.pdf') && text) {
        const fullUrl = href.startsWith('http') ? href : `https://www.dpsa.gov.za${href}`;
        pdfLinks.push({
          name: text,
          url: fullUrl,
        });
      }
    }
    
    console.log(`Found ${pdfLinks.length} department PDFs`);
    
    // Step 5: Parse PDFs and extract jobs (limit to first 5 PDFs to avoid timeout)
    const jobs: Job[] = [];
    const maxPdfs = 5;
    
    for (let i = 0; i < Math.min(pdfLinks.length, maxPdfs); i++) {
      const pdf = pdfLinks[i];
      console.log(`Processing PDF ${i + 1}/${Math.min(pdfLinks.length, maxPdfs)}: ${pdf.name}`);
      
      try {
        const pdfText = await parsePdfText(pdf.url);
        if (pdfText) {
          const extractedJobs = extractJobsFromText(pdfText, pdf.name);
          jobs.push(...extractedJobs);
          console.log(`Extracted ${extractedJobs.length} jobs from ${pdf.name}`);
        }
      } catch (error) {
        console.error(`Failed to process PDF ${pdf.name}:`, error);
      }
    }
    
    console.log(`Total extracted jobs: ${jobs.length}`);
    
    return new Response(JSON.stringify({
      success: true,
      circular: latestCircularText,
      circularUrl: latestCircularUrl,
      totalPdfs: pdfLinks.length,
      processedPdfs: Math.min(pdfLinks.length, maxPdfs),
      totalJobs: jobs.length,
      jobs: jobs,
      allPdfLinks: pdfLinks.slice(0, 10), // Return first 10 PDF links for reference
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
