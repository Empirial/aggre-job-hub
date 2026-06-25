import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi, type Job } from "@/lib/api";

export function useSavedJobs() {
  return useQuery({
    queryKey: ["savedJobs"],
    queryFn: () => profileApi.listSavedJobs(),
    staleTime: 30_000,
  });
}

export function useSaveJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (jobId: string) => profileApi.saveJob(jobId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["savedJobs"] }),
  });
}

export function useRemoveSavedJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (jobId: string) => profileApi.removeJob(jobId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["savedJobs"] }),
  });
}

export function useIsJobSaved(jobId: string) {
  const { data: savedJobs = [] } = useSavedJobs();
  return (savedJobs as Job[]).some((j) => j.id === jobId);
}
