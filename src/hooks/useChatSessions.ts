import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { chatApi } from "@/lib/api";

export function useChatSessions() {
  return useQuery({
    queryKey: ["chatSessions"],
    queryFn: () => chatApi.listSessions(),
    staleTime: 15_000,
  });
}

export function useDeleteChatSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) => chatApi.deleteSession(sessionId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["chatSessions"] }),
  });
}
