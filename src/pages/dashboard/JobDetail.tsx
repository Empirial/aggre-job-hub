import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, Globe, Loader2, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const mockJobs: Record<string, {
  id: string; title: string; company: string; location: string;
  datePosted: string; atsScore: number; source: string;
  description: string; keywords: string[]; niceToHave: string[];
  seniority: string; tone: string;
}> = {
  "1": {
    id: "1",
    title: "Senior Software Engineer",
    company: "FNB",
    location: "Johannesburg",
    datePosted: "2026-05-31",
    atsScore: 87,
    source: "indeed",
    seniority: "Senior",
    tone: "Corporate / Professional",
    description: `FNB is looking for a Senior Software Engineer to join our Core Banking team in Johannesburg.

You will be responsible for designing, building, and maintaining scalable backend services that power FNB's digital banking platform. You will work closely with product managers, architects, and other engineers to deliver high-quality software.

Responsibilities:
• Design and build robust, scalable backend APIs and microservices
• Participate in system architecture reviews and technical planning
• Mentor junior developers and conduct code reviews
• Collaborate with cross-functional teams including QA, DevOps, and Product
• Ensure code quality through unit testing, integration testing, and CI/CD practices

Requirements:
• 5+ years of software development experience
• Strong proficiency in Java or Python
• Experience with microservices, REST APIs, and event-driven architecture
• Knowledge of cloud platforms (AWS or Azure preferred)
• Experience with Docker, Kubernetes, and CI/CD pipelines
• Strong understanding of relational and NoSQL databases
• Excellent problem-solving and communication skills

Nice to have:
• Experience with Apache Kafka or similar messaging systems
• Knowledge of financial domain and banking systems
• AWS certifications`,
    keywords: [
      "Java", "Python", "Microservices", "REST APIs", "Docker",
      "Kubernetes", "CI/CD", "AWS", "Azure", "Kafka",
      "Backend", "Scalable", "Banking", "Event-driven",
    ],
    niceToHave: ["Apache Kafka", "Financial domain", "AWS certifications"],
  },
  "2": {
    id: "2",
    title: "Full Stack Developer",
    company: "Takealot",
    location: "Cape Town",
    datePosted: "2026-05-31",
    atsScore: 91,
    source: "pnet",
    seniority: "Mid-Senior",
    tone: "Startup / Collaborative",
    description: `Takealot, South Africa's leading e-commerce platform, is hiring a Full Stack Developer to join our Growth Engineering team.

You'll build features that serve millions of South African shoppers daily, working on both frontend (React) and backend (Node.js) systems.

Responsibilities:
• Build and maintain web applications using React and Node.js
• Integrate with third-party APIs and internal microservices
• Optimize application performance and user experience
• Write clean, tested, and well-documented code

Requirements:
• 3+ years full stack development experience
• React, TypeScript, Node.js proficiency
• Experience with PostgreSQL and Redis
• REST API design and integration
• Git version control
• Strong attention to detail`,
    keywords: [
      "React", "TypeScript", "Node.js", "PostgreSQL", "Redis",
      "REST API", "Full Stack", "Git", "E-commerce", "Performance",
    ],
    niceToHave: ["GraphQL", "Next.js", "AWS"],
  },
};

type GenerateState = "idle" | "generating" | "done";

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [genState, setGenState] = useState<GenerateState>("idle");

  const job = id ? mockJobs[id] : null;

  if (!job) {
    return (
      <div className="p-6">
        <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/jobs")}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <p className="mt-6 text-sm text-gray-400">Job not found.</p>
      </div>
    );
  }

  const handleGenerate = () => {
    setGenState("generating");
    setTimeout(() => setGenState("done"), 3000);
  };

  return (
    <div className="p-6 space-y-5">
      {/* Back */}
      <Button
        variant="ghost"
        size="sm"
        className="text-gray-500 hover:text-gray-900 -ml-2"
        onClick={() => navigate("/jobs")}
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Jobs Board
      </Button>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{job.title}</h1>
          <div className="flex items-center gap-3 mt-1.5 text-sm text-gray-500">
            <span className="font-medium text-gray-700">{job.company}</span>
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{job.location}</span>
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{job.datePosted}</span>
            <span className="flex items-center gap-1 capitalize"><Globe className="w-3.5 h-3.5" />{job.source}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-indigo-50 text-indigo-600 border-0 text-sm px-3 py-1">
            {job.atsScore}% ATS match
          </Badge>
          {genState === "idle" && (
            <Button
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={handleGenerate}
            >
              Generate Tailored CV
            </Button>
          )}
          {genState === "generating" && (
            <Button size="sm" disabled className="bg-indigo-400 text-white">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...
            </Button>
          )}
          {genState === "done" && (
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <CheckCircle className="w-4 h-4 mr-2" /> CV Ready — View
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Job Description */}
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

        {/* ATS Panel */}
        <div className="space-y-4">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">ATS Keywords</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1.5">
                {job.keywords.map((kw) => (
                  <Badge key={kw} className="bg-indigo-50 text-indigo-700 border-0 text-xs">
                    {kw}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Nice to Have</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1.5">
                {job.niceToHave.map((kw) => (
                  <Badge key={kw} className="bg-gray-100 text-gray-500 border-0 text-xs">
                    {kw}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Job Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Seniority</span>
                <span className="text-gray-700 font-medium">{job.seniority}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Tone</span>
                <span className="text-gray-700 font-medium">{job.tone}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
