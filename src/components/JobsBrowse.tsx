import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { ArrowRight, Briefcase, Calendar, Loader2, MapPin, Search } from "lucide-react";
import { Link } from "react-router-dom";
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

  const departments = useMemo(() => {
    const q = search.trim().toLowerCase();
    const matches = jobs.filter(
      (j) =>
        !q ||
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        (j.location || "").toLowerCase().includes(q)
    );
    const groups = new Map<string, Job[]>();
    for (const job of matches) {
      const dept = job.company || "Other vacancies";
      if (!groups.has(dept)) groups.set(dept, []);
      groups.get(dept)!.push(job);
    }
    return [...groups.entries()].sort((a, b) => b[1].length - a[1].length);
  }, [jobs, search]);

  return (
    <section id="jobs" className="bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-5 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Latest government vacancies</h2>
            <p className="text-sm text-gray-600 mt-2 max-w-2xl">
              Fresh listings from the official DPSA circulars, grouped by department — no sign-in
              needed to browse.
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search title, department or town..."
              className="pl-9 bg-white border-gray-200 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-sm text-gray-400">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />Loading vacancies...
          </div>
        ) : departments.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-600">
              {jobs.length === 0 ? "New circulars are on their way" : "No vacancies match your search"}
            </p>
            <p className="text-xs text-gray-400">
              {jobs.length === 0
                ? "Vacancies from the latest DPSA circular appear here as soon as the daily scrape runs."
                : "Try a different search term."}
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-8">
            {departments.map(([dept, deptJobs]) => (
              <div key={dept}>
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-base font-semibold text-gray-900">{dept}</h3>
                  <span className="text-xs text-gray-400 shrink-0">
                    {deptJobs.length} {deptJobs.length === 1 ? "post" : "posts"}
                  </span>
                </div>
                <div className="mt-3 grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {deptJobs.map((job) => (
                    <div
                      key={job.id}
                      className="rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md hover:border-brand-100 transition-all"
                    >
                      <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">
                        {job.title}
                      </p>
                      <div className="mt-2 flex items-center gap-3 flex-wrap">
                        {job.location && (
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <MapPin className="w-3 h-3" />
                            {job.location}
                          </span>
                        )}
                        {job.date_posted && (
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <Calendar className="w-3 h-3" />
                            {job.date_posted}
                          </span>
                        )}
                      </div>
                      {job.url && (
                        <a
                          href={job.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700"
                        >
                          View &amp; apply <ArrowRight className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="text-center pt-2">
              <Link to="/dashboard">
                <Button variant="outline" className="border-gray-200 text-gray-700">
                  Open the dashboard to tailor a CV for any of these
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
