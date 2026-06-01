import { TrendingUp, TrendingDown, Briefcase, FileText, SendHorizontal, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const stats = [
  {
    label: "Jobs Scraped Today",
    value: "47",
    change: "+12.4%",
    up: true,
    icon: Briefcase,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    label: "CVs Generated",
    value: "23",
    change: "+8.1%",
    up: true,
    icon: FileText,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    label: "Applications Sent",
    value: "18",
    change: "+5.3%",
    up: true,
    icon: SendHorizontal,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    label: "Interview Rate",
    value: "11%",
    change: "-2.1%",
    up: false,
    icon: Trophy,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
];

const chartData = [
  { day: "Mon", scraped: 38, sent: 12 },
  { day: "Tue", scraped: 42, sent: 15 },
  { day: "Wed", scraped: 31, sent: 9 },
  { day: "Thu", scraped: 55, sent: 21 },
  { day: "Fri", scraped: 47, sent: 18 },
  { day: "Sat", scraped: 12, sent: 4 },
  { day: "Sun", scraped: 8, sent: 2 },
];

const recentJobs = [
  { id: "1", title: "Senior Software Engineer", company: "FNB", location: "Johannesburg", time: "2 min ago", score: 87 },
  { id: "2", title: "Full Stack Developer", company: "Takealot", location: "Cape Town", time: "14 min ago", score: 91 },
  { id: "3", title: "Backend Engineer", company: "Discovery", location: "Sandton", time: "31 min ago", score: 78 },
  { id: "4", title: "React Developer", company: "Naspers", location: "Remote", time: "1 hr ago", score: 83 },
  { id: "5", title: "Python Developer", company: "Standard Bank", location: "Johannesburg", time: "2 hr ago", score: 74 },
];

export default function Overview() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Overview</h1>
          <p className="text-sm text-gray-500 mt-0.5">Sunday, 1 June 2026</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Run Scraper Now</Button>
          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">Generate CVs</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                  <p className="text-2xl font-semibold text-gray-900">{s.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {s.up ? (
                      <TrendingUp className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-400" />
                    )}
                    <span className={`text-xs font-medium ${s.up ? "text-emerald-500" : "text-red-400"}`}>
                      {s.change}
                    </span>
                    <span className="text-xs text-gray-400">vs last week</span>
                  </div>
                </div>
                <div className={`w-9 h-9 ${s.bg} rounded-lg flex items-center justify-center`}>
                  <s.icon className={`w-4.5 h-4.5 ${s.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart + Activity */}
      <div className="grid grid-cols-3 gap-4">
        {/* Chart */}
        <Card className="col-span-2 border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Weekly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} barGap={4}>
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                />
                <Bar dataKey="scraped" fill="#E0E7FF" radius={[4, 4, 0, 0]} name="Scraped" />
                <Bar dataKey="sent" fill="#4F46E5" radius={[4, 4, 0, 0]} name="Sent" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Jobs */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Recent Jobs Scraped</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 px-4">
            {recentJobs.map((job) => (
              <div key={job.id} className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-900 truncate">{job.title}</p>
                  <p className="text-xs text-gray-400">{job.company} · {job.location}</p>
                  <p className="text-xs text-gray-300 mt-0.5">{job.time}</p>
                </div>
                <Badge
                  variant="secondary"
                  className="text-xs shrink-0 bg-indigo-50 text-indigo-600 border-0"
                >
                  {job.score}%
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
