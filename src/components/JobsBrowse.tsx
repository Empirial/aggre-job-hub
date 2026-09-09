import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { ArrowUpRight, Briefcase, Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { jobsApi, type Job } from "@/lib/api";
import { db, firebaseConfigured } from "@/lib/firebase";

function usePublicJobs() {
  return useQuery({
    queryKey: ["public-jobs"],
    queryFn: async (): Promise<Job[]> => {
      if (firebaseConfigured && db) {
        try {
          const q = query(collection(db, "jobs"), orderBy("created_at", "desc"));
          const snapshot = await getDocs(q);
          if (!snapshot.empty) {
            return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Job);
          }
        } catch {
          // fall through to the public API
        }
      }
      return jobsApi.listPublic();
    },
    staleTime: 5 * 60_000,
    retry: false,
  });
}

export default function JobsBrowse() {
  const { data: jobs = [], isLoading } = usePublicJobs();
  const [search, setSearch] = useState("");

  const filtered = jobs.filter((job) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      job.title.toLowerCase().includes(q) ||
      job.company.toLowerCase().includes(q) ||
      (job.location || "").toLowerCase().includes(q)
    );
  });

  return (
    <section id="jobs" className="bg-white">
      <div className="max-w-6xl mx-auto px-5 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-900">Government vacancies</h2>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search department or title..."
              className="pl-9 bg-white border-gray-200 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-sm text-gray-400">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Loading vacancies...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-600">
              {jobs.length === 0 ? "No vacancies right now" : "No vacancies match your search"}
            </p>
            <p className="text-xs text-gray-400">
              {jobs.length === 0
                ? "New DPSA circular posts appear here as soon as they are published."
                : "Try a different search term."}
            </p>
          </div>
        ) : (
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((job) => (
              <div
                key={job.id}
                className="group rounded-xl border border-gray-100 bg-white p-4 hover:border-brand-200 hover:shadow-sm transition-all"
              >
                <p className="text-xs font-medium text-brand-600 mb-2">
                  {job.company || "Government"}
                </p>
                <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">
                  {job.title}
                </h3>
                <div className="mt-4 flex items-center gap-2">
                  {job.url ? (
                    <>
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-gray-500 hover:text-gray-700 underline underline-offset-2 truncate"
                      >
                        View listing
                      </a>
                      <Button
                        asChild
                        size="sm"
                        className="ml-auto bg-[#F7941D] hover:bg-[#E08518] text-white text-xs h-8"
                      >
                        <a href={job.url} target="_blank" rel="noopener noreferrer">
                          Apply <ArrowUpRight className="w-3 h-3 ml-1" />
                        </a>
                      </Button>
                    </>
                  ) : (
                    <span className="text-xs text-gray-400">No application link</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
