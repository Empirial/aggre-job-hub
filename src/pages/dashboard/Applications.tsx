import { useState } from "react";
import { Calendar, Building2, FileText, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useApplications, type Application } from "@/hooks/useApplications";

type Status = Application["status"];

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

export default function Applications() {
  const { data: applications = [], isLoading, isError } = useApplications();
  const [filter, setFilter] = useState<Status | "all">("all");

  const filtered = filter === "all"
    ? applications
    : applications.filter((a) => a.status === filter);

  const summaryCounts = applications.reduce(
    (acc, a) => { acc[a.status] = (acc[a.status] || 0) + 1; return acc; },
    {} as Record<Status, number>
  );

  return (

    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Applications</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {isLoading ? "Loading..." : `${applications.length} total`}
          </p>
        </div>
      </div>

      <div className="flex gap-1">
        {statusFilters.map(({ value, label }) => {
          const count = value === "all" ? applications.length : (summaryCounts[value as Status] || 0);
          return (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                filter === value ? "bg-brand-600 text-white" : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {label}
              {count > 0 && (
                <span className={`text-xs rounded-full px-1.5 py-0.5 leading-none font-semibold ${
                  filter === value ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                }`}>{count}</span>
              )}
            </button>
          );
        })}
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-0 overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-sm text-gray-400">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />Loading applications...
            </div>
          ) : isError ? (
            <div className="text-center py-12 text-sm text-red-400">
              Failed to load applications.
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-medium text-gray-600 px-5 py-3">Job Title</th>
                  <th className="text-left text-xs font-medium text-gray-600 px-4 py-3">Company</th>
                  <th className="text-left text-xs font-medium text-gray-600 px-4 py-3">Date Applied</th>
                  <th className="text-left text-xs font-medium text-gray-600 px-4 py-3">Status</th>
                  <th className="text-left text-xs font-medium text-gray-600 px-4 py-3">CV</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((app, i) => {
                  const sc = statusConfig[app.status];
                  return (
                    <tr key={app.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${i === filtered.length - 1 ? "border-0" : ""}`}>
                      <td className="px-5 py-3.5 text-sm font-medium text-gray-900">{app.jobTitle}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <Building2 className="w-3.5 h-3.5 text-gray-400" />{app.company}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Calendar className="w-3.5 h-3.5" />{app.dateApplied}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge className={`text-xs border-0 ${sc.className}`}>{sc.label}</Badge>
                      </td>
                      <td className="px-4 py-3.5">
                        {app.cvUrl ? (
                          <a href={app.cvUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="sm" className="h-7 text-xs text-brand-600 px-2">
                              <FileText className="w-3.5 h-3.5 mr-1" />View
                            </Button>
                          </a>
                        ) : (
                          <span className="text-xs text-gray-300 px-2">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          {!isLoading && !isError && filtered.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-14">
              <p className="text-sm text-gray-500">
                {applications.length === 0 ? "No applications tracked yet." : "No applications match this filter."}
              </p>
              {applications.length === 0 && (
                <a href="/jobs">
                  <Button size="sm" className="bg-[#F7941D] hover:bg-[#E08518] text-white">
                    Browse Jobs
                  </Button>
                </a>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
