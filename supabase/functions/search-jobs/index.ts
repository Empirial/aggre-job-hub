import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface JobSearchParams {
  keywords?: string;
  location?: string;
  page?: number;
  pageSize?: number;
  contractType?: string;
  workHours?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { keywords = '', location = '', page = 1, pageSize = 20, contractType, workHours }: JobSearchParams = await req.json();
    
    const apiKey = Deno.env.get('CAREERJET_API_KEY');
    
    if (!apiKey) {
      throw new Error('CAREERJET_API_KEY not configured');
    }

    // Create Basic Auth credentials
    const credentials = btoa(`${apiKey}:`);
    
    // Build query parameters
    const params = new URLSearchParams({
      locale_code: 'en_ZA', // South Africa English
      keywords: keywords,
      location: location,
      page: page.toString(),
      page_size: pageSize.toString(),
      user_ip: '0.0.0.0', // Required by API
      user_agent: 'JobSearch/1.0', // Required by API
    });

    if (contractType) {
      params.append('contract_type', contractType);
    }

    if (workHours) {
      params.append('work_hours', workHours);
    }

    console.log('Requesting Careerjet API with params:', params.toString());

    const response = await fetch(`https://search.api.careerjet.net/v4/query?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Careerjet API error:', response.status, errorText);
      throw new Error(`Careerjet API returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('Careerjet API response:', data);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in search-jobs function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
