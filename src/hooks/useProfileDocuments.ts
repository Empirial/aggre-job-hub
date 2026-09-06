import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { documentsApi } from "@/lib/api";

export function useProfileDocuments() {
  return useQuery({
    queryKey: ["profileDocuments"],
    queryFn: () => documentsApi.list(),
    staleTime: 30_000,
  });
}

export function useUploadProfileDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ file, docType }: { file: File; docType: "cv" | "supporting" }) =>
      documentsApi.upload(file, docType),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["profileDocuments"] }),
  });
}

export function useDeleteProfileDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (docId: string) => documentsApi.delete(docId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["profileDocuments"] }),
  });
}
