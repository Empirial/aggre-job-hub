import { Briefcase, FileText, RefreshCw, Loader2, ChevronRight, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useJobs, useScrapeJobs } from "@/hooks/useJobs";
import { useProfile } from "@/hooks/useProfile";
import { useNavigate } from "react-router-dom";

const DEFAULT_KEYWORDS = ["software engineer", "developer", "python", "react"];

export default function Overview() {
  const navigate = useNavigate();
  const { data: jobs = [], isLoading: jobsLoading } = useJobs();
  const { data: profile } = useProfile();
  const scrape = useScrapeJobs();

  const loading = jobsLoading;

  // Use saved job preference keywords if available, fall back to defaults
  const scrapeKeywords: string[] =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (profile as any)?.jobPreferences?.keywords?.length
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ? (profile as any).jobPreferences.keywords
      : DEFAULT_KEYWORDS;

  const cvGenerated = jobs.filter((j) => j.cv_generated).length;
  const today = new Date().toLocaleDateString("en-ZA", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const recentJobs = jobs.slice(0, 5);

  const profileFields = [
    !!profile?.name,
    !!profile?.email,
    !!profile?.summary,
    (profile?.skills?.length ?? 0) > 0,
    (profile?.experience?.length ?? 0) > 0,
    !!profile?.education,
  ];
  const profilePct = Math.round((profileFields.filter(Boolean).length / profileFields.length) * 100);
  const profileIncomplete = profilePct < 100;

  // Build last-7-days chart from job created_at timestamps
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const label = d.toLocaleDateString("en-ZA", { weekday: "short" });
    const dateStr = d.toISOString().slice(0, 10);
    const scraped = jobs.filter((j) => j.created_at?.slice(0, 10) === dateStr).length;
    return { day: label, scraped };
  });

  const pipeline = [
    { label: "Scraped", value: loading ? "—" : String(jobs.length), icon: Briefcase },
    { label: "CVs Ready", value: loading ? "—" : String(cvGenerated), icon: FileText },
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
          className="bg-brand-600 hover:bg-brand-700 text-white"
          onClick={() => scrape.mutate({ keywords: scrapeKeywords, location: "South Africa" })}
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

      {/* Profile completion banner */}
      {profileIncomplete && (
        <button
          onClick={() => navigate("/settings")}
          className="w-full flex items-center gap-3 bg-brand-50 border border-brand-100 rounded-xl px-4 py-3 text-left hover:bg-brand-100/60 transition-colors"
        >
          <AlertCircle className="w-4 h-4 text-brand-500 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-brand-700">Profile {profilePct}% complete</span>
              <span className="text-xs text-brand-500">Finish setup →</span>
            </div>
            <div className="h-1.5 bg-brand-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-500 rounded-full transition-all"
                style={{ width: `${profilePct}%` }}
              />
            </div>
          </div>
        </button>
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
                <Bar dataKey="scraped" fill="#F7941D" radius={[4, 4, 0, 0]} name="Scraped" />
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
                <button
                  key={job.id}
                  onClick={() => navigate(`/jobs/${job.id}`)}
                  className="w-full flex items-start justify-between gap-2 hover:bg-gray-50 rounded-lg px-1 py-1.5 -mx-1 transition-colors text-left"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-900 truncate">{job.title}</p>
                    <p className="text-xs text-gray-400">{job.company} · {job.location}</p>
                  </div>
                  {job.ats_score ? (
                    <Badge className="text-xs shrink-0 bg-brand-50 text-brand-600 border-0">
                      {job.ats_score}%
                    </Badge>
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-gray-300 shrink-0 mt-0.5" />
                  )}
                </button>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
