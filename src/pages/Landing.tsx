import { Link } from "react-router-dom";
import {
  ArrowRight,
  Search,
  FileText,
  SendHorizontal,
  BarChart3,
  ScanText,
  MessageSquare,
  ShieldCheck,
  Clock,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import JobsBrowse from "@/components/JobsBrowse";

const steps = [
  {
    icon: Search,
    title: "We find the jobs",
    body: "Scrapers pull fresh listings daily from PNet, Indeed, LinkedIn, Adzuna and DPSA circulars — filtered to your keywords and provinces.",
  },
  {
    icon: ScanText,
    title: "We read the ATS",
    body: "Every job description is analysed for the exact keywords, tone and seniority the applicant tracking system screens for.",
  },
  {
    icon: FileText,
    title: "We tailor the CV",
    body: "Your base CV is rewritten per job to mirror those requirements — truthfully — and exported as a clean, ATS-safe .docx.",
  },
  {
    icon: SendHorizontal,
    title: "You approve, we send",
    body: "Review the tailored CV, hit send, and the application goes out by email. Status is tracked from sent to interview.",
  },
];

const features = [
  { icon: BarChart3, title: "Application tracker", body: "Every application in one table — sent, pending, interview, rejected — with dates and ATS match scores." },
  { icon: FileText, title: "Z83 & government ready", body: "Built for the South African market: DPSA circulars, Z83 forms, closing dates and rand salary bands." },
  { icon: MessageSquare, title: "AI career chat", body: "Ask about a job spec, interview prep or salary expectations and get answers grounded in your own profile." },
  { icon: ScanText, title: "Document AI", body: "Upload an existing CV or certificate and we extract the detail straight into your profile — no retyping." },
  { icon: Clock, title: "Runs while you sleep", body: "The pipeline runs every morning at 6am, so new matches are waiting before you open the dashboard." },
  { icon: ShieldCheck, title: "Your data stays yours", body: "Documents are stored privately against your account and only used to build your applications." },
];

const stats = [
  { value: "8", label: "Job sources scraped" },
  { value: "6am", label: "Daily pipeline run" },
  { value: "< 60s", label: "To a tailored CV" },
  { value: "100%", label: "ATS-safe exports" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center gap-7 text-sm text-gray-600">
            <a href="#how" className="hover:text-gray-900">How it works</a>
            <a href="#features" className="hover:text-gray-900">Features</a>
            <a href="#faq" className="hover:text-gray-900">FAQ</a>
          </nav>
          <Link to="/dashboard">
            <Button size="sm" className="bg-[#F7941D] hover:bg-[#E08518] text-white">
              Open dashboard
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-gray-100 bg-[#F0F2F5]">
        <div className="max-w-6xl mx-auto px-5 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-medium bg-brand-50 text-brand-700 px-3 py-1.5 rounded-full">
              Built for South African job seekers
            </span>
            <h1 className="mt-5 text-4xl lg:text-5xl font-semibold text-gray-900 leading-[1.1]">
              Apply to more jobs.
              <br />
              Do far less work.
            </h1>
            <p className="mt-5 text-base text-gray-600 max-w-xl leading-relaxed">
              CareerGate finds the listings, reads the ATS requirements, rewrites your CV for each
              role and tracks every application — so your effort goes into interviews, not admin.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/dashboard">
                <Button className="bg-[#F7941D] hover:bg-[#E08518] text-white">
                  Start applying <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
              <Link to="/jobs">
                <Button variant="outline" className="border-gray-200 text-gray-700">
                  Browse the jobs board
                </Button>
              </Link>
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-500">
              {["No CV rewriting by hand", "Government & private roles", "Free to start"].map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Pipeline preview card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-gray-700">Today's pipeline</p>
              <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Live</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { l: "Jobs scraped", v: "42" },
                { l: "CVs tailored", v: "12" },
                { l: "Applications sent", v: "9" },
                { l: "Interviews", v: "2" },
              ].map((s) => (
                <div key={s.l} className="rounded-xl bg-[#F0F2F5] px-4 py-3">
                  <p className="text-xl font-semibold text-gray-900">{s.v}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.l}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2.5">
              {[
                { t: "Data Analyst — Absa", m: "Johannesburg · 92% ATS match" },
                { t: "Software Developer — Capitec", m: "Stellenbosch · 88% ATS match" },
                { t: "Admin Clerk — DPSA Circular 12", m: "Pretoria · Z83 ready" },
              ].map((j) => (
                <div key={j.t} className="flex items-center justify-between border-b border-gray-50 pb-2.5 last:border-0">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-900 truncate">{j.t}</p>
                    <p className="text-xs text-gray-400">{j.m}</p>
                  </div>
                  <span className="text-xs text-brand-600 bg-brand-50 px-2 py-0.5 rounded shrink-0">CV ready</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-5 py-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="px-4 py-3">
            <p className="text-2xl font-semibold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </section>

      {/* How it works */}
      <section id="how" className="bg-[#F0F2F5] border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-5 py-16">
          <h2 className="text-2xl font-semibold text-gray-900">How CareerGate works</h2>
          <p className="text-sm text-gray-600 mt-2 max-w-2xl">
            Four steps run end to end. You only step in where judgement matters — approving what gets sent.
          </p>
          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((s, i) => (
              <div key={s.title} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center justify-between">
                  <s.icon className="w-5 h-5 text-brand-600" />
                  <span className="text-xs font-medium text-gray-300">0{i + 1}</span>
                </div>
                <h3 className="mt-4 text-sm font-semibold text-gray-900">{s.title}</h3>
                <p className="mt-1.5 text-sm text-gray-600 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-5 py-16">
        <h2 className="text-2xl font-semibold text-gray-900">Everything in one dashboard</h2>
        <p className="text-sm text-gray-600 mt-2 max-w-2xl">
          The jobs board, CV editor, application tracker, AI chat and document scanner all work off the
          same profile.
        </p>
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border border-gray-100 p-5 hover:shadow-sm transition-shadow">
              <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center">
                <f.icon className="w-4 h-4 text-brand-600" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-gray-900">{f.title}</h3>
              <p className="mt-1.5 text-sm text-gray-600 leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-[#F0F2F5] border-y border-gray-100">
        <div className="max-w-3xl mx-auto px-5 py-16">
          <h2 className="text-2xl font-semibold text-gray-900">Questions</h2>
          <div className="mt-6 space-y-4">
            {[
              { q: "Does it apply without me?", a: "No. Applications only go out once you review the tailored CV and approve it. The automation stops at your desk." },
              { q: "Will the tailored CV be accurate?", a: "The AI rewrites wording and emphasis to mirror the job's keywords. It never invents experience — it works from the profile and CV you provide." },
              { q: "Which jobs are covered?", a: "Private sector listings from PNet, Indeed, LinkedIn, Adzuna, Careerjet and The Muse, plus DPSA government circulars with Z83 support." },
              { q: "What does it cost?", a: "You can scrape jobs, tailor CVs and track applications from the dashboard at no cost while CareerGate is in early access." },
            ].map((f) => (
              <div key={f.q} className="bg-white rounded-xl border border-gray-100 p-5">
                <h3 className="text-sm font-semibold text-gray-900">{f.q}</h3>
                <p className="mt-1.5 text-sm text-gray-600 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-5 py-16 text-center">
        <h2 className="text-2xl font-semibold text-gray-900">Your path to being employed</h2>
        <p className="text-sm text-gray-600 mt-2 max-w-lg mx-auto">
          Set up your profile once. CareerGate handles the searching, the tailoring and the tracking from there.
        </p>
        <Link to="/dashboard" className="inline-block mt-6">
          <Button className="bg-[#F7941D] hover:bg-[#E08518] text-white">
            Open the dashboard <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </Link>
      </section>

      <footer className="border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-5 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo />
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} CareerGate · careergate.co.za
          </p>
        </div>
      </footer>
    </div>
  );
}
