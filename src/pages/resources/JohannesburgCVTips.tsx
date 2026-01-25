import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  CheckCircle,
  ArrowLeft,
  Clock,
  Calendar,
  Building2,
  XCircle,
  Lightbulb,
  Target
} from "lucide-react";
import { Link } from "react-router-dom";

const JohannesburgCVTips = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/resources" className="text-muted-foreground hover:text-primary flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              Career Resources
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">Johannesburg CV Tips</span>
          </div>
        </div>
      </div>

      {/* Article */}
      <article className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Badge variant="secondary">Job Search</Badge>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="w-4 h-4" />
                10 min read
              </span>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                January 2026
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              How to Write a CV That Lands an Interview in Johannesburg
            </h1>

            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Johannesburg's job market is highly competitive, with thousands of qualified candidates vying for positions in finance, technology, and corporate sectors. Your CV is often your only chance to make a first impression. This guide provides Gauteng-specific advice to help your application stand out.
            </p>

            <div className="w-full h-64 md:h-80 bg-gradient-hero rounded-xl mb-10 flex items-center justify-center">
              <FileText className="w-20 h-20 text-white/50" />
            </div>

            <div className="prose prose-lg max-w-none">
              
              <h2 className="text-2xl font-bold mt-10 mb-4 flex items-center gap-2">
                <Building2 className="w-6 h-6 text-primary" />
                Understanding Johannesburg's Corporate Culture
              </h2>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Johannesburg is South Africa's financial and commercial hub, home to the Johannesburg Stock Exchange, major banks, multinational corporations, and a thriving startup ecosystem. The city's hiring culture tends to be more formal and results-oriented compared to other South African cities. Employers here value professionalism, quantifiable achievements, and clear career progression.
              </p>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                Recruiters in Johannesburg often receive hundreds of applications for a single position. Many use Applicant Tracking Systems (ATS) to filter candidates before a human even sees your CV. This means your CV must be optimized for both software and human readers.
              </p>

              <h2 className="text-2xl font-bold mt-10 mb-4 flex items-center gap-2">
                <Target className="w-6 h-6 text-primary" />
                CV Structure That Works in Gauteng
              </h2>

              <Card className="p-6 mb-6">
                <h3 className="font-semibold mb-4">Recommended CV Format</h3>
                <ol className="space-y-4 text-muted-foreground">
                  <li>
                    <strong>1. Contact Details (Top of page)</strong>
                    <p className="text-sm mt-1">Full name, phone number, professional email, LinkedIn profile URL, and area/suburb (e.g., "Sandton" or "Rosebank" - full address not necessary). Including your general location helps recruiters assess commute feasibility.</p>
                  </li>
                  <li>
                    <strong>2. Professional Summary (3-4 lines)</strong>
                    <p className="text-sm mt-1">A brief, punchy statement highlighting your experience level, key skills, and what you bring to the role. Tailor this for each application.</p>
                  </li>
                  <li>
                    <strong>3. Key Skills (6-10 bullet points)</strong>
                    <p className="text-sm mt-1">Include both technical skills and soft skills relevant to the position. Use keywords from the job description.</p>
                  </li>
                  <li>
                    <strong>4. Work Experience (Most recent first)</strong>
                    <p className="text-sm mt-1">Job title, company name, dates, and 3-5 achievement-focused bullet points per role. Quantify wherever possible.</p>
                  </li>
                  <li>
                    <strong>5. Education</strong>
                    <p className="text-sm mt-1">Degrees, diplomas, and relevant certifications. Include institution name and graduation year.</p>
                  </li>
                  <li>
                    <strong>6. Additional Sections (Optional)</strong>
                    <p className="text-sm mt-1">Languages, professional memberships, volunteer work, or relevant projects.</p>
                  </li>
                </ol>
              </Card>

              <h2 className="text-2xl font-bold mt-10 mb-4">Formatting Rules for Johannesburg Employers</h2>

              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <Card className="p-5">
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    Do This
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Keep it to 2 pages maximum (1 page for entry-level)</li>
                    <li>• Use a clean, professional font (Arial, Calibri, or Helvetica)</li>
                    <li>• Save and send as PDF to preserve formatting</li>
                    <li>• Use consistent date formats (e.g., "Jan 2023 - Dec 2025")</li>
                    <li>• Include your LinkedIn URL</li>
                    <li>• Tailor your CV for each application</li>
                    <li>• Proofread multiple times for errors</li>
                  </ul>
                </Card>

                <Card className="p-5">
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-red-600">
                    <XCircle className="w-5 h-5" />
                    Avoid This
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Including a photo (unless specifically requested)</li>
                    <li>• Listing personal details like marital status or religion</li>
                    <li>• Using an unprofessional email address</li>
                    <li>• Writing in first person ("I managed...")</li>
                    <li>• Including "References available upon request"</li>
                    <li>• Using colored backgrounds or fancy graphics</li>
                    <li>• Leaving gaps in employment unexplained</li>
                  </ul>
                </Card>
              </div>

              <h2 className="text-2xl font-bold mt-10 mb-4">Writing Achievement-Focused Bullet Points</h2>

              <p className="text-muted-foreground mb-6">
                Johannesburg employers want to see measurable impact, not just job duties. Transform your bullet points using the "Action Verb + Task + Result" formula:
              </p>

              <Card className="p-6 mb-6">
                <h4 className="font-semibold mb-4">Before and After Examples</h4>
                <div className="space-y-4">
                  <div className="border-l-4 border-red-400 pl-4">
                    <span className="text-sm text-red-600 font-medium">Weak:</span>
                    <p className="text-muted-foreground">"Responsible for sales in the Gauteng region"</p>
                  </div>
                  <div className="border-l-4 border-green-400 pl-4">
                    <span className="text-sm text-green-600 font-medium">Strong:</span>
                    <p className="text-muted-foreground">"Grew Gauteng regional sales by 35% (R2.4M) within 18 months by developing partnerships with 12 new corporate clients"</p>
                  </div>
                  
                  <div className="border-l-4 border-red-400 pl-4 mt-6">
                    <span className="text-sm text-red-600 font-medium">Weak:</span>
                    <p className="text-muted-foreground">"Managed a team of call centre agents"</p>
                  </div>
                  <div className="border-l-4 border-green-400 pl-4">
                    <span className="text-sm text-green-600 font-medium">Strong:</span>
                    <p className="text-muted-foreground">"Led a team of 15 call centre agents, improving customer satisfaction scores from 72% to 91% and reducing average call handling time by 20%"</p>
                  </div>
                </div>
              </Card>

              <h2 className="text-2xl font-bold mt-10 mb-4">Industry-Specific Tips for Johannesburg</h2>

              <div className="space-y-4 mb-8">
                <Card className="p-5">
                  <h4 className="font-semibold mb-2">Financial Services (Sandton, Rosebank)</h4>
                  <p className="text-sm text-muted-foreground">
                    Emphasize regulatory knowledge (FAIS, FICA), risk management experience, and quantitative achievements. Include relevant certifications (RE5, CFA, CIMA). Banks value stability—show clear progression and avoid job-hopping.
                  </p>
                </Card>
                <Card className="p-5">
                  <h4 className="font-semibold mb-2">Technology (Sandton, Midrand, Bryanston)</h4>
                  <p className="text-sm text-muted-foreground">
                    Include a technical skills section with programming languages, frameworks, and tools. Link to your GitHub or portfolio. Show projects you've shipped and their impact. Startups value versatility; corporates value depth.
                  </p>
                </Card>
                <Card className="p-5">
                  <h4 className="font-semibold mb-2">Mining & Resources (CBD, Rosebank)</h4>
                  <p className="text-sm text-muted-foreground">
                    Highlight safety certifications, compliance knowledge, and experience with SHEQ processes. Include any mine-specific tickets or competencies. Emphasize project delivery and cost management.
                  </p>
                </Card>
              </div>

              <Card className="p-6 bg-primary/5 border-primary/20 mb-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-primary" />
                  Local Insider Tips
                </h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                    <span><strong>Mention your location strategically:</strong> If you live near the job location (e.g., "Based in Sandton" for a Sandton role), include it prominently. Commute concerns are real in Johannesburg.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                    <span><strong>Include "Load shedding resilience":</strong> For roles requiring consistent connectivity, mention if you have backup power or a generator at home.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                    <span><strong>Leverage LinkedIn:</strong> Johannesburg recruiters are heavy LinkedIn users. Ensure your profile matches your CV and connect with recruiters in your industry.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                    <span><strong>Follow up professionally:</strong> A brief follow-up email 5-7 days after applying is acceptable and often expected in Johannesburg's corporate culture.</span>
                  </li>
                </ul>
              </Card>

              <div className="bg-gradient-hero rounded-xl p-8 text-white text-center">
                <h3 className="text-2xl font-bold mb-4">Ready to Apply?</h3>
                <p className="text-white/90 mb-6 max-w-xl mx-auto">
                  Put your new CV to work. Browse thousands of Johannesburg and Gauteng job listings on CareerGate.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link to="/jobs">
                    <Button size="lg" variant="secondary">
                      Browse Gauteng Jobs
                    </Button>
                  </Link>
                  <Link to="/jobs?category=learnerships">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                      Learnerships
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default JohannesburgCVTips;
