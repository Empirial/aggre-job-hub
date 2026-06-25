import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi, type UserProfile } from "@/lib/api";

export type { UserProfile };

const DEFAULT_PROFILE: UserProfile = {
  name: "",
  email: "",
  phone: "",
  linkedin: "",
  summary: "",
  skills: [],
  experience: [],
  education: "",
  keywords: [],
  locations: [],
  jobTypes: { fullTime: true, remote: false, contract: false },
};

const LS_KEY = "cg_user_profile";

function loadFromLocalStorage(): UserProfile | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return { ...DEFAULT_PROFILE, ...JSON.parse(raw) } as UserProfile;
  } catch { /* ignore */ }
  return null;
}

function saveToLocalStorage(profile: UserProfile) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(profile));
  } catch { /* ignore */ }
}

export function useProfile() {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: async (): Promise<UserProfile> => {
      try {
        const profile = await profileApi.get();
        if (profile && Object.keys(profile).length > 0) {
          const merged = { ...DEFAULT_PROFILE, ...profile };
          saveToLocalStorage(merged);
          return merged;
        }
      } catch { /* backend unavailable */ }
      return loadFromLocalStorage() ?? DEFAULT_PROFILE;
    },
    staleTime: 60_000,
  });
}

export function useSaveProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      saveToLocalStorage(profile);
      await profileApi.save(profile);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["userProfile"] }),
  });
}
