import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SheetJob {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  tags: string[];
  postedDate: string;
  link: string;
}

export interface SheetBursary {
  id: string;
  name: string;
  provider: string;
  type: string;
  eligibility: string;
  deadline: string;
  fields: string;
  covers: string[];
  link: string;
  tips: string;
}

export function useGoogleSheets<T>(sheetName: 'jobs' | 'bursaries') {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      console.log(`Fetching ${sheetName} from Google Sheets...`);
      
      const { data: response, error: fnError } = await supabase.functions.invoke('fetch-google-sheets', {
        body: { sheet: sheetName },
      });

      if (fnError) {
        console.error('Function error:', fnError);
        throw new Error(fnError.message);
      }

      if (!response.success) {
        console.error('Response error:', response.error);
        throw new Error(response.error || 'Failed to fetch data');
      }

      console.log(`Received ${response.data?.length || 0} items from ${sheetName} sheet`);
      setData(response.data || []);
    } catch (err: any) {
      console.error(`Error fetching ${sheetName}:`, err);
      setError(err.message || 'Failed to fetch data');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [sheetName]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
