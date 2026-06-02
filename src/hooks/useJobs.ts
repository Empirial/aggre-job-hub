import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { collection, getDocs, doc, getDoc, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { jobsApi, type Job } from "@/lib/api";

export function useJobs() {
  return useQuery({
    queryKey: ["jobs"],
    queryFn: async (): Promise<Job[]> => {
      try {
        const q = query(collection(db, "jobs"), orderBy("created_at", "desc"));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Job));
        }
      } catch {
        // Firestore not configured or empty — fall through to API
      }
      return jobsApi.list();
    },
    staleTime: 60_000,
  });
}

export function useJob(id: string) {
  return useQuery({
    queryKey: ["jobs", id],
    queryFn: async (): Promise<Job | null> => {
      try {
        const snap = await getDoc(doc(db, "jobs", id));
        if (snap.exists()) return { id: snap.id, ...snap.data() } as Job;
      } catch {
        // fall through
      }
      return jobsApi.get(id);
    },
    enabled: !!id,
  });
}

export function useScrapeJobs() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ keywords, location }: { keywords: string[]; location: string }) =>
      jobsApi.scrape(keywords, location),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["jobs"] }),
  });
}
