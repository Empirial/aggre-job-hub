import { useState } from "react";
import { Calendar, Building2, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Status = "pending" | "sent" | "rejected" | "interview";

const mockApplications: {
  id: string; jobTitle: string; company: string;
  dateApplied: string; status: Status; cvUrl?: string;
}[] = [
  { id: "1", jobTitle: "Senior Software Engineer", company: "FNB", dateApplied: "2026-05-31", status: "interview" },
  { id: "2", jobTitle: "Full Stack Developer", company: "Takealot", dateApplied: "2026-05-31", status: "sent" },
  { id: "3", jobTitle: "Backend Engineer", company: "Discovery Health", dateApplied: "2026-05-30", status: "pending" },
  { id: "4", jobTitle: "React Developer", company: "Naspers", dateApplied: "2026-05-29", status: "rejected" },
  { id: "5", jobTitle: "Python Developer", company: "Standard Bank", dateApplied: "2026-05-29", status: "sent" },
  { id: "6", jobTitle: "DevOps Engineer", company: "Vodacom", dateApplied: "2026-05-28", status: "pending" },
  { id: "7", jobTitle: "Cloud Architect", company: "Capitec", dateApplied: "2026-05-27", status: "sent" },
  { id: "8", jobTitle: "Data Engineer", company: "MTN", dateApplied: "2026-05-26", status: "rejected" },
];

const statusConfig: Record<Status, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-amber-50 text-amber-600" },
  sent: { label: "Sent", className: "bg-blue-50 text-blue-600" },
  rejected: { label: "Rejected", className: "bg-red-50 text-red-500" },
  interview: { label: "Interview", className: "bg-emerald-50 text-emerald-600" },
};

const statusFilters: { value: Status | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "sent", label: "Sent" },
  { value: "interview", label: "Interview" },
  { value: "rejected", label: "Rejected" },
];

const summaryCounts = mockApplications.reduce(
  (acc, a) => { acc[a.status] = (acc[a.status] || 0) + 1; return acc; },
  {} as Record<Status, number>
);

export default function Applications() {
  const [filter, setFilter] = useState<Status | "all">("all");

  const filtered = filter === "all"
    ? mockApplications
    : mockApplications.filter((a) => a.status === filter);

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Applications</h1>
          <p className="text-sm text-gray-500 mt-0.5">{mockApplications.length} total applications</p>
        </div>
      </div>

      {/* Summary pills */}
      <div className="flex gap-3">
        {(["interview", "sent", "pending", "rejected"] as Status[]).map((s) => (
          <div
            key={s}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${statusConfig[s].className} bg-opacity-60`}
            onClick={() => setFilter(s)}
          >
            <span className="capitalize">{s}</span>
            <span className="font-semibold">{summaryCounts[s] || 0}</span>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1">
        {statusFilters.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === value
                ? "bg-indigo-600 text-white"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-medium text-gray-400 px-5 py-3">Job Title</th>
                <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">Company</th>
                <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">Date Applied</th>
                <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">Status</th>
                <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">CV</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((app, i) => {
                const sc = statusConfig[app.status];
                return (
                  <tr
                    key={app.id}
                    className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                      i === filtered.length - 1 ? "border-0" : ""
                    }`}
                  >
                    <td className="px-5 py-3.5">
                      <span className="text-sm font-medium text-gray-900">{app.jobTitle}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <Building2 className="w-3.5 h-3.5 text-gray-400" />
                        {app.company}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="w-3.5 h-3.5" />
                        {app.dateApplied}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge className={`text-xs border-0 ${sc.className}`}>
                        {sc.label}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5">
                      <Button variant="ghost" size="sm" className="h-7 text-xs text-indigo-600 hover:text-indigo-700 px-2">
                        <FileText className="w-3.5 h-3.5 mr-1" /> View CV
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-sm text-gray-400">No applications match this filter.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
