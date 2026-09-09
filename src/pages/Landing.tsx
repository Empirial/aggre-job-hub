import { Link } from "react-router-dom";
import {
  ArrowRight,
  Search,
  FileText,
  Download,
  BarChart3,
  ScanText,
  MessageSquare,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import JobsBrowse from "@/components/JobsBrowse";

const steps = [
  {
    icon: Search,
    title: "We find the jobs",
    body: "Every new DPSA circular is pulled daily and split per department — Sports, Arts & Culture, Agriculture, Health and the rest.",
  },
  {
    icon: ScanText,
    title: "We read the ATS",
    body: "Every job description is analysed for the exact keywords, tone and seniority the applicant tracking system screens for.",
  },
  {
    icon: FileText,
    title: "We tailor the CV",
    body: "Your base CV is rewritten per job to mirror those requirements — truthfully — and exported as a clean, ATS-safe PDF.",
  },
  {
    icon: Download,
    title: "You download and apply",
    body: "Download your tailored CV and completed Z83 form, then submit them the way the department asks for it.",
  },
];

const features = [
  { icon: BarChart3, title: "Application tracker", body: "Every application in one table — sent, pending, interview, rejected — with dates and ATS match scores." },
  { icon: FileText, title: "Z83 form filler", body: "Fill the official Z83 by chatting or typing, then download the completed form ready to submit." },
  { icon: MessageSquare, title: "AI career chat", body: "Ask about a job spec, interview prep or salary expectations and get answers grounded in your own profile." },
  { icon: ScanText, title: "Document AI", body: "Upload an existing CV or certificate and we extract the detail straight into your profile — no retyping." },
  { icon: Clock, title: "Runs while you sleep", body: "The pipeline runs every morning at 6am, so new matches are waiting before you open the dashboard." },
  { icon: ShieldCheck, title: "Your data stays yours", body: "Documents are stored privately against your account and only used to build your applications." },
];


export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center gap-7 text-sm text-gray-600">
            <a href="#jobs" className="hover:text-gray-900">Vacancies</a>
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

      {/* Public vacancies by department */}
      <JobsBrowse />


      {/* How it works */}
      <section id="how" className="bg-[#F0F2F5] border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-5 py-16">
          <h2 className="text-2xl font-semibold text-gray-900">How CareerGate works</h2>
          <p className="text-sm text-gray-600 mt-2 max-w-2xl">
            Four steps run end to end. You stay in control — you download and submit the final application yourself.
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
              { q: "Does it apply for me?", a: "No. CareerGate prepares your tailored CV and Z83 form — you download them and submit them to the department yourself." },
              { q: "Will the tailored CV be accurate?", a: "The AI rewrites wording and emphasis to mirror the job's keywords. It never invents experience — it works from the profile and CV you provide." },
              { q: "Which jobs are covered?", a: "Only South African government posts, straight from the official DPSA circulars, with the Z83 form filled in for you. We deliberately leave private job boards out." },
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
