import { Briefcase, FileText, SendHorizontal, Trophy, RefreshCw, Loader2, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useJobs, useScrapeJobs } from "@/hooks/useJobs";
import { useApplications } from "@/hooks/useApplications";

export default function Overview() {
  const { data: jobs = [], isLoading: jobsLoading } = useJobs();
  const { data: applications = [], isLoading: appsLoading } = useApplications();
  const scrape = useScrapeJobs();

  const loading = jobsLoading || appsLoading;

  const cvGenerated = jobs.filter((j) => j.cv_generated).length;
  const sent = applications.filter((a) => a.status === "sent" || a.status === "interview").length;
  const interviews = applications.filter((a) => a.status === "interview").length;
  const today = new Date().toLocaleDateString("en-ZA", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const recentJobs = jobs.slice(0, 5);

  // Build last-7-days chart from job created_at timestamps
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const label = d.toLocaleDateString("en-ZA", { weekday: "short" });
    const dateStr = d.toISOString().slice(0, 10);
    const scraped = jobs.filter((j) => j.created_at?.startsWith(dateStr)).length;
    const appsOnDay = applications.filter((a) => a.dateApplied?.startsWith(dateStr)).length;
    return { day: label, scraped, sent: appsOnDay };
  });

  const pipeline = [
    { label: "Scraped", value: loading ? "—" : String(jobs.length), icon: Briefcase },
    { label: "CVs Ready", value: loading ? "—" : String(cvGenerated), icon: FileText },
    { label: "Applied", value: loading ? "—" : String(sent), icon: SendHorizontal },
    { label: "Interviews", value: loading ? "—" : String(interviews), icon: Trophy },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Overview</h1>
          <p className="text-sm text-gray-500 mt-0.5">{today}</p>
        </div>
        <Button
          size="sm"
          className="bg-[#F7941D] hover:bg-[#E08518] text-white"
          onClick={() => scrape.mutate({ keywords: ["software engineer", "developer", "python", "react"], location: "South Africa" })}
          disabled={scrape.isPending}
        >
          {scrape.isPending
            ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Scraping...</>
            : <><RefreshCw className="w-3.5 h-3.5 mr-1.5" />Run Scraper</>}
        </Button>
      </div>

      {scrape.isSuccess && (
        <div className="text-xs text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg">
          Done — {scrape.data.saved} new jobs saved.
        </div>
      )}

      {/* Pipeline strip */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex divide-x divide-gray-100">
        {pipeline.map((stage, i) => (
          <div key={stage.label} className="flex-1 flex items-center gap-3 px-5 py-4">
            <stage.icon className={`w-4 h-4 flex-shrink-0 ${i === 0 ? "text-brand-600" : i === pipeline.length - 1 ? "text-emerald-600" : "text-gray-400"}`} />
            <div>
              <p className="text-xl font-semibold text-gray-900">{stage.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stage.label}</p>
            </div>
            {i < pipeline.length - 1 && (
              <ChevronRight className="w-3.5 h-3.5 text-gray-300 ml-auto hidden sm:block" />
            )}
          </div>
        ))}
      </div>

      {/* Chart + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Last 7 Days</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} barGap={4}>
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                <Bar dataKey="scraped" fill="#FEF3E2" radius={[4, 4, 0, 0]} name="Scraped" />
                <Bar dataKey="sent" fill="#F7941D" radius={[4, 4, 0, 0]} name="Sent" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Recent Jobs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 px-4">
            {jobsLoading ? (
              <div className="flex items-center gap-2 text-xs text-gray-400 py-4">
                <Loader2 className="w-3 h-3 animate-spin" />Loading...
              </div>
            ) : recentJobs.length === 0 ? (
              <p className="text-xs text-gray-400 py-4">No jobs yet. Run the scraper.</p>
            ) : (
              recentJobs.map((job) => (
                <div key={job.id} className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-900 truncate">{job.title}</p>
                    <p className="text-xs text-gray-400">{job.company} · {job.location}</p>
                  </div>
                  {job.ats_score && (
                    <Badge className="text-xs shrink-0 bg-brand-50 text-brand-600 border-0">
                      {job.ats_score}%
                    </Badge>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
