import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Calendar, ChevronRight, RefreshCw, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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

const sourceColor: Record<string, string> = {
  indeed: "bg-blue-50 text-blue-600",
  pnet: "bg-purple-50 text-purple-600",
  linkedin: "bg-sky-50 text-sky-600",
};

export default function JobsBoard() {
  const navigate = useNavigate();
  const { data: jobs = [], isLoading, isError } = useJobs();
  const scrape = useScrapeJobs();
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("all");
  const [source, setSource] = useState("all");

  const locations = [...new Set(jobs.map((j) => j.location))].filter(Boolean);

  const filtered = jobs.filter((j) => {
    const matchSearch =
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase());
    const matchLocation = location === "all" || j.location === location;
    const matchSource = source === "all" || j.source === source;
    return matchSearch && matchLocation && matchSource;
  });

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Jobs Board</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {isLoading ? "Loading..." : `${jobs.length} listings`}
          </p>
        </div>
        <Button
          size="sm"
          className="bg-brand-600 hover:bg-brand-700 text-white"
          onClick={() => scrape.mutate({ keywords: ["software engineer", "developer", "python", "react"], location: "South Africa" })}
          disabled={scrape.isPending}
        >
          {scrape.isPending
            ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Scraping...</>
            : <><RefreshCw className="w-4 h-4 mr-2" />Run Scraper</>}
        </Button>
      </div>

      {scrape.isSuccess && (
        <div className="text-xs text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg">
          Scraped {scrape.data.scraped} jobs — {scrape.data.saved} new saved.
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search jobs or companies..."
            className="pl-9 bg-white border-gray-200 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={location} onValueChange={setLocation}>
          <SelectTrigger className="w-44 bg-white border-gray-200 text-sm">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All locations</SelectItem>
            {locations.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={source} onValueChange={setSource}>
          <SelectTrigger className="w-36 bg-white border-gray-200 text-sm">
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sources</SelectItem>
            <SelectItem value="indeed">Indeed</SelectItem>
            <SelectItem value="pnet">PNet</SelectItem>
            <SelectItem value="linkedin">LinkedIn</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-0 overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-sm text-gray-400">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />Loading jobs...
            </div>
          ) : isError ? (
            <div className="text-center py-12 text-sm text-red-400">
              Failed to load jobs. Is the backend running at localhost:8000?
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-medium text-gray-600 px-5 py-3">Job Title</th>
                  <th className="text-left text-xs font-medium text-gray-600 px-4 py-3">Company</th>
                  <th className="text-left text-xs font-medium text-gray-600 px-4 py-3">Location</th>
                  <th className="text-left text-xs font-medium text-gray-600 px-4 py-3">Date Posted</th>
                  <th className="text-left text-xs font-medium text-gray-600 px-4 py-3">Source</th>
                  <th className="text-left text-xs font-medium text-gray-600 px-4 py-3">ATS Score</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((job, i) => (
                  <tr
                    key={job.id}
                    className={`border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${i === filtered.length - 1 ? "border-0" : ""}`}
                    onClick={() => navigate(`/jobs/${job.id}`)}
                  >
                    <td className="px-5 py-3.5 text-sm font-medium text-gray-900">{job.title}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-600">{job.company}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <MapPin className="w-3 h-3" />{job.location}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="w-3 h-3" />{job.date_posted || "—"}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge className={`text-xs border-0 capitalize ${sourceColor[job.source] || "bg-gray-100 text-gray-500"}`}>
                        {job.source}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge className={`text-xs border-0 ${scoreColor(job.ats_score)}`}>
                        {job.ats_score ? `${job.ats_score}%` : "—"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5">
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!isLoading && !isError && filtered.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-14">
              <p className="text-sm text-gray-500">
                {jobs.length === 0 ? "No jobs scraped yet." : "No jobs match your filters."}
              </p>
              {jobs.length === 0 && (
                <Button
                  size="sm"
                  className="bg-[#F7941D] hover:bg-[#E08518] text-white"
                  onClick={() => scrape.mutate({ keywords: ["software engineer", "developer", "python", "react"], location: "South Africa" })}
                  disabled={scrape.isPending}
                >
                  {scrape.isPending ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Scraping...</> : <><RefreshCw className="w-3.5 h-3.5 mr-1.5" />Run Scraper</>}
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
