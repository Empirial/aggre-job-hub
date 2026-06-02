import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, Globe, Loader2, CheckCircle, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useJob } from "@/hooks/useJobs";
import { cvApi } from "@/lib/api";

type GenerateState = "idle" | "generating" | "done";

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: job, isLoading, isError } = useJob(id!);
  const [genState, setGenState] = useState<GenerateState>("idle");

  const handleGenerate = async () => {
    if (!job) return;
    setGenState("generating");
    try {
      await cvApi.tailor({
        profile: {
          name: "Lufuno Mphela",
          email: "lufuno@mphelaindustries.co.za",
          phone: "+27 73 000 0000",
          linkedin: "linkedin.com/in/lufunomphela",
          summary: "Full-stack developer with 4 years experience in React, Python, Node.js.",
          skills: ["React", "TypeScript", "Python", "Node.js", "PostgreSQL", "Docker", "AWS"],
          experience: [
            "Built internal tools using React and Node.js to streamline procurement workflows",
            "Designed RESTful APIs consumed by mobile and web clients",
            "Managed PostgreSQL database schema and wrote complex queries",
          ],
          education: "BSc Computer Science — UNISA (In Progress, 2026)",
        },
        job: {
          title: job.title,
          company: job.company,
          location: job.location,
          description: job.description,
        },
      });
      setGenState("done");
    } catch {
      setGenState("idle");
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center gap-2 text-sm text-gray-400">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading job...
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="p-6">
        <Button variant="ghost" size="sm" onClick={() => navigate("/jobs")}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <p className="mt-6 text-sm text-red-400">Job not found or backend unavailable.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-5">
      <Button
        variant="ghost"
        size="sm"
        className="text-gray-500 hover:text-gray-900 -ml-2"
        onClick={() => navigate("/jobs")}
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Jobs Board
      </Button>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{job.title}</h1>
          <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-gray-500">
            <span className="font-medium text-gray-700">{job.company}</span>
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{job.location}</span>
            {job.date_posted && <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{job.date_posted}</span>}
            <span className="flex items-center gap-1 capitalize"><Globe className="w-3.5 h-3.5" />{job.source}</span>
            {job.url && (
              <a href={job.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-indigo-500 hover:underline">
                <ExternalLink className="w-3.5 h-3.5" /> View original
              </a>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {job.ats_score && (
            <Badge className="bg-indigo-50 text-indigo-600 border-0 text-sm px-3 py-1">
              {job.ats_score}% ATS
            </Badge>
          )}
          {genState === "idle" && (
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleGenerate}>
              Generate Tailored CV
            </Button>
          )}
          {genState === "generating" && (
            <Button size="sm" disabled className="bg-indigo-400 text-white">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating...
            </Button>
          )}
          {genState === "done" && (
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => navigate("/cv-editor")}>
              <CheckCircle className="w-4 h-4 mr-2" />CV Ready — View
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="col-span-2">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-sm text-gray-600 whitespace-pre-wrap font-sans leading-relaxed">
                {job.description}
              </pre>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {job.keywords?.length > 0 && (
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">ATS Keywords</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {job.keywords.map((kw) => (
                    <Badge key={kw} className="bg-indigo-50 text-indigo-700 border-0 text-xs">{kw}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Job Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Source</span>
                <span className="text-gray-700 font-medium capitalize">{job.source}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">CV Generated</span>
                <span className={`font-medium ${job.cv_generated ? "text-emerald-600" : "text-gray-400"}`}>
                  {job.cv_generated ? "Yes" : "No"}
                </span>
              </div>
              {job.ats_score && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">ATS Score</span>
                  <span className="text-indigo-600 font-medium">{job.ats_score}%</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
