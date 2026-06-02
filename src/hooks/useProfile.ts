import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  summary: string;
  skills: string[];
  experience: string[];
  education: string;
}

const DEFAULT_PROFILE: UserProfile = {
  name: "",
  email: "",
  phone: "",
  linkedin: "",
  summary: "",
  skills: [],
  experience: [],
  education: "",
};

export function useProfile() {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: async (): Promise<UserProfile> => {
      try {
        const snap = await getDoc(doc(db, "userProfile", "default"));
        if (snap.exists()) return { ...DEFAULT_PROFILE, ...snap.data() } as UserProfile;
      } catch {
        // Firestore unavailable — return empty profile
      }
      return DEFAULT_PROFILE;
    },
    staleTime: 60_000,
  });
}

export function useSaveProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      await setDoc(doc(db, "userProfile", "default"), profile);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["userProfile"] }),
  });
}
