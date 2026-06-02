import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  dateApplied: string;
  status: "pending" | "sent" | "rejected" | "interview";
  cvUrl?: string;
}

export function useApplications() {
  return useQuery({
    queryKey: ["applications"],
    queryFn: async (): Promise<Application[]> => {
      try {
        const q = query(collection(db, "applications"), orderBy("dateApplied", "desc"));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Application));
        }
      } catch {
        // Firestore not ready — return empty
      }
      return [];
    },
    staleTime: 30_000,
  });
}
