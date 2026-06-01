import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Calendar, ChevronRight } from "lucide-react";
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

const mockJobs = [
  { id: "1", title: "Senior Software Engineer", company: "FNB", location: "Johannesburg", datePosted: "2026-05-31", atsScore: 87, source: "indeed" },
  { id: "2", title: "Full Stack Developer", company: "Takealot", location: "Cape Town", datePosted: "2026-05-31", atsScore: 91, source: "pnet" },
  { id: "3", title: "Backend Engineer", company: "Discovery Health", location: "Sandton", datePosted: "2026-05-30", atsScore: 78, source: "linkedin" },
  { id: "4", title: "React Developer", company: "Naspers", location: "Remote", datePosted: "2026-05-30", atsScore: 83, source: "indeed" },
  { id: "5", title: "Python Developer", company: "Standard Bank", location: "Johannesburg", datePosted: "2026-05-29", atsScore: 74, source: "pnet" },
  { id: "6", title: "DevOps Engineer", company: "Vodacom", location: "Midrand", datePosted: "2026-05-29", atsScore: 69, source: "linkedin" },
  { id: "7", title: "Cloud Architect", company: "Capitec", location: "Stellenbosch", datePosted: "2026-05-28", atsScore: 82, source: "indeed" },
  { id: "8", title: "Data Engineer", company: "MTN", location: "Johannesburg", datePosted: "2026-05-28", atsScore: 76, source: "pnet" },
  { id: "9", title: "Mobile Developer (React Native)", company: "OUTsurance", location: "Centurion", datePosted: "2026-05-27", atsScore: 88, source: "indeed" },
  { id: "10", title: "Software Architect", company: "Absa", location: "Johannesburg", datePosted: "2026-05-27", atsScore: 71, source: "linkedin" },
];

const scoreColor = (score: number) => {
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
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("all");
  const [source, setSource] = useState("all");

  const filtered = mockJobs.filter((j) => {
    const matchSearch =
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase());
    const matchLocation = location === "all" || j.location === location;
    const matchSource = source === "all" || j.source === source;
    return matchSearch && matchLocation && matchSource;
  });

  const locations = [...new Set(mockJobs.map((j) => j.location))];

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Jobs Board</h1>
          <p className="text-sm text-gray-500 mt-0.5">{mockJobs.length} listings scraped</p>
        </div>
        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
          Run Scraper
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
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
            {locations.map((l) => (
              <SelectItem key={l} value={l}>{l}</SelectItem>
            ))}
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

      {/* Table */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-medium text-gray-400 px-5 py-3">Job Title</th>
                <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">Company</th>
                <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">Location</th>
                <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">Date Posted</th>
                <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">Source</th>
                <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">ATS Score</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((job, i) => (
                <tr
                  key={job.id}
                  className={`border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${i === filtered.length - 1 ? "border-0" : ""}`}
                  onClick={() => navigate(`/dashboard/jobs/${job.id}`)}
                >
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-medium text-gray-900">{job.title}</span>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-600">{job.company}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <MapPin className="w-3 h-3" />
                      {job.location}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {job.datePosted}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge className={`text-xs border-0 capitalize ${sourceColor[job.source]}`}>
                      {job.source}
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge className={`text-xs border-0 ${scoreColor(job.atsScore)}`}>
                      {job.atsScore}%
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5">
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-sm text-gray-400">No jobs match your filters.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
