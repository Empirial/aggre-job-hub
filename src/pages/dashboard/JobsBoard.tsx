import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, MapPin, Calendar, RefreshCw, Loader2, Briefcase,
  ChevronRight, ExternalLink,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useJobs, useScrapeJobs } from "@/hooks/useJobs";

const scoreColor = (score?: number) => {
  if (!score) return "bg-gray-100 text-gray-400";
  if (score >= 85) return "bg-emerald-50 text-emerald-600";
  if (score >= 70) return "bg-amber-50 text-amber-600";
  return "bg-red-50 text-red-500";
};

const sourceLabel = (source?: string) =>
  source === "dpsa" ? "Government" : source === "manual" ? "Added by you" : "Job board";

const sourceColor = (source?: string) =>
  source === "dpsa" ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500";

export default function JobsBoard() {
  const navigate = useNavigate();
  const { data: jobs = [], isLoading, isError } = useJobs();
  const scrape = useScrapeJobs();
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("all");
  const [department, setDepartment] = useState("all");

  const locations = [...new Set(jobs.map((j) => j.location))].filter(Boolean);
  const departments = [...new Set(jobs.filter((j) => j.source === "dpsa").map((j) => j.company))]
    .filter(Boolean)
    .sort();

  const filtered = jobs.filter((j) => {
    const matchSearch =
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase());
    const matchLocation = location === "all" || j.location === location;
    const matchDepartment = department === "all" || j.company === department;
    return matchSearch && matchLocation && matchDepartment;
  });

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Find Jobs</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {isLoading
              ? "Loading vacancies..."
              : filtered.length === jobs.length
                ? `${jobs.length} vacancies available`
                : `${filtered.length} of ${jobs.length} vacancies`}
          </p>
        </div>
        <Button
          size="sm"
          className="bg-brand-600 hover:bg-brand-700 text-white w-full sm:w-auto"
          onClick={() =>
            scrape.mutate({
              keywords: [],
              location: "South Africa",
            })
          }
          disabled={scrape.isPending}
        >
          {scrape.isPending ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Finding jobs...</>
          ) : (
            <><RefreshCw className="w-4 h-4 mr-2" />Refresh jobs</>
          )}
        </Button>
      </div>

      {scrape.isSuccess && (
        <div className="text-xs text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg">
          {scrape.data.saved > 0
            ? `${scrape.data.saved} new vacancies added.`
            : "You're up to date — no new vacancies right now."}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search jobs or companies..."
            className="pl-9 bg-white border-gray-200 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={location} onValueChange={setLocation}>
          <SelectTrigger className="w-full sm:w-44 bg-white border-gray-200 text-sm">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All locations</SelectItem>
            {locations.map((l) => (
              <SelectItem key={l} value={l}>{l}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {departments.length > 0 && (
        <Select value={department} onValueChange={setDepartment}>
          <SelectTrigger className="w-full sm:w-72 bg-white border-gray-200 text-sm">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All government departments</SelectItem>
            {departments.map((d) => (
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-sm text-gray-400">
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />Loading jobs...
        </div>
      ) : isError ? (
        <div className="text-center py-16 text-sm text-gray-500">
          We couldn't load vacancies right now. Please try again in a moment.
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-20">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <Briefcase className="w-6 h-6 text-gray-300" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">
              {jobs.length === 0 ? "No vacancies yet" : "Nothing matches your search"}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {jobs.length === 0
                ? "Tap refresh to pull the latest South African vacancies"
                : "Try a different search or clear the filters"}
            </p>
          </div>
          {jobs.length === 0 && (
            <Button
              size="sm"
              className="bg-brand-600 hover:bg-brand-700 text-white"
              onClick={() =>
                scrape.mutate({
                  keywords: [],
                  location: "South Africa",
                })
              }
              disabled={scrape.isPending}
            >
              {scrape.isPending ? (
                <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Finding jobs...</>
              ) : (
                <><RefreshCw className="w-3.5 h-3.5 mr-1.5" />Refresh jobs</>
              )}
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((job) => (
            <button
              key={job.id}
              onClick={() => navigate(`/jobs/${job.id}`)}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-left hover:shadow-md hover:border-brand-100 transition-all group"
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-brand-600 transition-colors">
                    {job.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{job.company}</p>
                </div>
                {job.ats_score ? (
                  <Badge className={`text-xs border-0 shrink-0 font-semibold ${scoreColor(job.ats_score)}`}>
                    {job.ats_score}%
                  </Badge>
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-300 shrink-0 mt-0.5 group-hover:text-brand-400 transition-colors" />
                )}
              </div>

              {/* Meta row */}
              <div className="flex items-center gap-3 flex-wrap">
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

              {/* Footer row */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                <Badge className={`text-xs border-0 ${sourceColor(job.source)}`}>
                  {sourceLabel(job.source)}
                </Badge>
                {job.cv_generated ? (
                  <span className="text-xs text-emerald-500 font-medium flex items-center gap-1">
                    <ExternalLink className="w-3 h-3" />
                    CV ready
                  </span>
                ) : (
                  <span className="text-xs text-gray-400">Tailor my CV →</span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
