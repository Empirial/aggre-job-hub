import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useIsJobSaved } from "./useSavedJobs";
import type { Job } from "@/lib/api";

const SAVED_JOB: Job = {
  id: "job-42",
  title: "State Veterinarian",
  company: "Department of Agriculture",
  location: "Mpumalanga: Skukuza",
  description: "Diagnose and treat livestock.",
  url: "https://www.dpsa.gov.za/job-42",
  source: "dpsa",
  keywords: [],
  cv_generated: false,
  created_at: "2026-09-11T00:00:00Z",
};

function renderWithSavedJobs(jobs: Job[], jobId: string) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  queryClient.setQueryData(["savedJobs"], jobs);

  function wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  }

  return renderHook(() => useIsJobSaved(jobId), { wrapper });
}

describe("useIsJobSaved", () => {
  it("returns true when the job is in the saved-jobs list", () => {
    const { result } = renderWithSavedJobs([SAVED_JOB], "job-42");
    expect(result.current).toBe(true);
  });

  it("returns false when the job is not in the saved-jobs list", () => {
    const { result } = renderWithSavedJobs([SAVED_JOB], "some-other-job");
    expect(result.current).toBe(false);
  });

  it("returns false when nothing is saved yet", () => {
    const { result } = renderWithSavedJobs([], "job-42");
    expect(result.current).toBe(false);
  });
});
