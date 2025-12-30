import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SPREADSHEET_ID = '1qpnl2rLv-kTOub23aB5LVBCpDNCfQcfm3IY9zBtnRNs';
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes cache

// In-memory cache
interface CacheEntry {
  data: any[];
  timestamp: number;
}

const cache: Map<string, CacheEntry> = new Map();

// Parse CSV string into array of objects
function parseCSV(csvText: string): Record<string, string>[] {
  const lines = csvText.split('\n').filter(line => line.trim());
  if (lines.length < 2) return [];
  
  // Parse header row
  const headers = parseCSVLine(lines[0]);
  
  // Parse data rows
  const data: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header.toLowerCase().trim()] = values[index]?.trim() || '';
    });
    data.push(row);
  }
  
  return data;
}

// Parse a single CSV line, handling quoted values
function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current);
  
  return values;
}

// Check if cache is valid
function getCachedData(sheetName: string): any[] | null {
  const entry = cache.get(sheetName);
  if (!entry) return null;
  
  const now = Date.now();
  if (now - entry.timestamp > CACHE_TTL_MS) {
    cache.delete(sheetName);
    return null;
  }
  
  return entry.data;
}

// Set cache data
function setCacheData(sheetName: string, data: any[]): void {
  cache.set(sheetName, {
    data,
    timestamp: Date.now(),
  });
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sheet, forceRefresh } = await req.json();
    
    if (!sheet) {
      throw new Error('Sheet name is required (jobs or bursaries)');
    }

    const sheetName = sheet.toLowerCase();
    
    // Check cache first (unless force refresh is requested)
    if (!forceRefresh) {
      const cachedData = getCachedData(sheetName);
      if (cachedData) {
        console.log(`Returning cached data for ${sheetName} (${cachedData.length} items)`);
        return new Response(JSON.stringify({ 
          success: true, 
          data: cachedData,
          count: cachedData.length,
          cached: true
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    console.log(`Fetching fresh data from sheet: ${sheetName}`);

    // Fetch the published Google Sheet as CSV
    const sheetUrl = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheet)}`;
    
    console.log(`Fetching URL: ${sheetUrl}`);
    
    const response = await fetch(sheetUrl);
    
    if (!response.ok) {
      console.error(`Failed to fetch sheet: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to fetch sheet: ${response.statusText}`);
    }

    const csvText = await response.text();
    console.log(`Received CSV data (first 500 chars): ${csvText.substring(0, 500)}`);
    
    const data = parseCSV(csvText);
    console.log(`Parsed ${data.length} rows from ${sheetName} sheet`);

    // Transform data based on sheet type
    let transformedData;
    
    if (sheetName === 'jobs') {
      transformedData = data.map((row, index) => ({
        id: (index + 1).toString(),
        title: row.title || '',
        company: row.company || '',
        location: row.location || '',
        type: row.type || 'Full-time',
        salary: row.salary || '',
        description: row.description || '',
        tags: row.tags ? row.tags.split(',').map(t => t.trim()) : [],
        postedDate: row.posteddate || row.posted_date || row.date || 'Recently',
        link: row.link || '',
      }));
    } else if (sheetName === 'bursaries') {
      transformedData = data.map((row, index) => ({
        id: (index + 1).toString(),
        name: row.name || '',
        provider: row.provider || '',
        type: row.type || 'General',
        eligibility: row.eligibility || '',
        deadline: row.deadline || '',
        fields: row.fields || '',
        covers: row.covers ? row.covers.split(',').map(c => c.trim()) : [],
        link: row.link || '',
        tips: row.tips || '',
      }));
    } else {
      transformedData = data;
    }

    // Cache the transformed data
    setCacheData(sheetName, transformedData);
    console.log(`Cached ${transformedData.length} items for ${sheetName}`);

    return new Response(JSON.stringify({ 
      success: true, 
      data: transformedData,
      count: transformedData.length,
      cached: false
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error in fetch-google-sheets function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage,
      data: [] 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
