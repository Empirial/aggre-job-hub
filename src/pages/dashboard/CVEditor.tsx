import { useState } from "react";
import { Download, Send, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const baseCV = {
  summary:
    "Full-stack software developer with 4 years of experience building scalable web applications. Proficient in React, TypeScript, Node.js, and Python. Strong background in API design and cloud infrastructure.",
  skills: "React, TypeScript, Node.js, Python, PostgreSQL, Redis, Docker, AWS, Git, REST APIs",
  experience: [
    {
      role: "Software Developer",
      company: "Mphela Industries",
      period: "2023 – Present",
      bullets: [
        "Built internal tools using React and Node.js to streamline procurement workflows",
        "Designed RESTful APIs consumed by mobile and web clients",
        "Managed PostgreSQL database schema and wrote complex queries",
      ],
    },
    {
      role: "Junior Developer",
      company: "Freelance",
      period: "2022 – 2023",
      bullets: [
        "Developed client websites using React and Tailwind CSS",
        "Integrated third-party APIs including payment gateways and mapping services",
        "Delivered 8 projects on time across retail and services industries",
      ],
    },
  ],
  education: "BSc Computer Science — UNISA (In Progress, 2026)",
};

const tailoredCV = {
  summary:
    "Senior-level full-stack engineer with 4+ years delivering scalable microservices and banking-grade APIs. Deep expertise in Java, Python, REST API design, Docker, and Kubernetes. Proven track record deploying to AWS in CI/CD-driven environments. Collaborative communicator who mentors junior engineers and leads technical reviews.",
  skills:
    "Java, Python, Microservices, REST APIs, Docker, Kubernetes, CI/CD, AWS, Kafka, PostgreSQL, Redis, TypeScript, React, Git",
  experience: [
    {
      role: "Software Developer",
      company: "Mphela Industries",
      period: "2023 – Present",
      bullets: [
        "Architected and deployed event-driven microservices using Python and Docker, reducing system latency by 40%",
        "Designed scalable REST APIs with robust authentication and rate limiting, serving 10k+ daily requests",
        "Implemented CI/CD pipelines on AWS, cutting release cycles from weekly to daily deployments",
      ],
    },
    {
      role: "Junior Developer",
      company: "Freelance",
      period: "2022 – 2023",
      bullets: [
        "Built backend services in Python and Node.js with PostgreSQL and Redis caching layers",
        "Integrated Kafka-based messaging for async processing in high-throughput client applications",
        "Delivered 8 production-grade projects with full test coverage and documentation",
      ],
    },
  ],
  education: "BSc Computer Science — UNISA (In Progress, 2026)",
};

type Section = "summary" | "skills" | "education";

export default function CVEditor() {
  const [editedTailored, setEditedTailored] = useState(tailoredCV);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({ 0: true, 1: true });

  const toggleExp = (i: number) =>
    setExpanded((prev) => ({ ...prev, [i]: !prev[i] }));

  const updateBullet = (expIdx: number, bulletIdx: number, value: string) => {
    setEditedTailored((prev) => {
      const updated = { ...prev };
      updated.experience = prev.experience.map((exp, i) =>
        i === expIdx
          ? { ...exp, bullets: exp.bullets.map((b, j) => (j === bulletIdx ? value : b)) }
          : exp
      );
      return updated;
    });
  };

  const updateField = (field: Section, value: string) => {
    setEditedTailored((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">CV Editor</h1>
          <p className="text-sm text-gray-500 mt-0.5">Tailored for: Senior Software Engineer — FNB</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" /> Download .docx
          </Button>
          <Button size="sm" className="bg-brand-600 hover:bg-brand-700 text-white">
            <Send className="w-4 h-4 mr-2" /> Approve & Send
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Base CV */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-medium text-gray-700">Base CV</h2>
            <Badge className="bg-gray-100 text-gray-500 border-0 text-xs">Original</Badge>
          </div>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-1 pt-4 px-5">
              <CardTitle className="text-xs font-medium text-gray-400 uppercase tracking-wide">Summary</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-4">
              <p className="text-sm text-gray-600 leading-relaxed">{baseCV.summary}</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-1 pt-4 px-5">
              <CardTitle className="text-xs font-medium text-gray-400 uppercase tracking-wide">Skills</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-4">
              <p className="text-sm text-gray-600">{baseCV.skills}</p>
            </CardContent>
          </Card>

          {baseCV.experience.map((exp, i) => (
            <Card key={i} className="border-0 shadow-sm">
              <CardHeader className="pb-1 pt-4 px-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{exp.role}</p>
                    <p className="text-xs text-gray-400">{exp.company} · {exp.period}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-5 pb-4">
                <ul className="space-y-1">
                  {exp.bullets.map((b, j) => (
                    <li key={j} className="text-sm text-gray-600 flex gap-2">
                      <span className="text-gray-300 mt-0.5">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-1 pt-4 px-5">
              <CardTitle className="text-xs font-medium text-gray-400 uppercase tracking-wide">Education</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-4">
              <p className="text-sm text-gray-600">{baseCV.education}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tailored CV */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-medium text-gray-700">Tailored CV</h2>
            <Badge className="bg-brand-50 text-brand-600 border-0 text-xs">ATS Optimized</Badge>
          </div>

          <Card className="border-0 shadow-sm ring-1 ring-brand-100">
            <CardHeader className="pb-1 pt-4 px-5">
              <CardTitle className="text-xs font-medium text-gray-400 uppercase tracking-wide">Summary</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-4">
              <Textarea
                value={editedTailored.summary}
                onChange={(e) => updateField("summary", e.target.value)}
                className="text-sm text-gray-700 border-0 p-0 focus-visible:ring-0 resize-none bg-transparent"
                rows={4}
              />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm ring-1 ring-brand-100">
            <CardHeader className="pb-1 pt-4 px-5">
              <CardTitle className="text-xs font-medium text-gray-400 uppercase tracking-wide">Skills</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-4">
              <Textarea
                value={editedTailored.skills}
                onChange={(e) => updateField("skills", e.target.value)}
                className="text-sm text-gray-700 border-0 p-0 focus-visible:ring-0 resize-none bg-transparent"
                rows={2}
              />
            </CardContent>
          </Card>

          {editedTailored.experience.map((exp, i) => (
            <Card key={i} className="border-0 shadow-sm ring-1 ring-brand-100">
              <CardHeader className="pb-1 pt-4 px-5 cursor-pointer" onClick={() => toggleExp(i)}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{exp.role}</p>
                    <p className="text-xs text-gray-400">{exp.company} · {exp.period}</p>
                  </div>
                  {expanded[i] ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </CardHeader>
              {expanded[i] && (
                <CardContent className="px-5 pb-4 space-y-2">
                  {exp.bullets.map((b, j) => (
                    <div key={j} className="flex gap-2">
                      <span className="text-gray-300 mt-2 text-xs">•</span>
                      <Textarea
                        value={b}
                        onChange={(e) => updateBullet(i, j, e.target.value)}
                        className="text-sm text-gray-700 border-0 p-0 focus-visible:ring-0 resize-none bg-transparent flex-1"
                        rows={2}
                      />
                    </div>
                  ))}
                </CardContent>
              )}
            </Card>
          ))}

          <Card className="border-0 shadow-sm ring-1 ring-brand-100">
            <CardHeader className="pb-1 pt-4 px-5">
              <CardTitle className="text-xs font-medium text-gray-400 uppercase tracking-wide">Education</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-4">
              <Textarea
                value={editedTailored.education}
                onChange={(e) => updateField("education", e.target.value)}
                className="text-sm text-gray-700 border-0 p-0 focus-visible:ring-0 resize-none bg-transparent"
                rows={1}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
