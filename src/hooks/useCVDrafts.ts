import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi, type CVDraft } from "@/lib/api";

export function useCVDrafts() {
  return useQuery({
    queryKey: ["cvDrafts"],
    queryFn: () => profileApi.listDrafts(),
    staleTime: 30_000,
  });
}

export function useSaveCVDraft() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (draft: CVDraft) => profileApi.saveDraft(draft),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cvDrafts"] }),
  });
}

export function useDeleteCVDraft() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (draftId: string) => profileApi.deleteDraft(draftId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cvDrafts"] }),
  });
}
