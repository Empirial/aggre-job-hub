import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  GraduationCap, 
  AlertTriangle, 
  CheckCircle,
  ArrowLeft,
  Clock,
  Calendar,
  FileText,
  XCircle,
  Lightbulb
} from "lucide-react";
import { Link } from "react-router-dom";

const NsfasApplicationMistakes = () => {
  const commonMistakes = [
    {
      number: 1,
      title: "Submitting Incomplete or Incorrect Documentation",
      description: "One of the most frequent reasons for NSFAS application rejections is missing or incorrect documentation. Many applicants fail to provide all required documents or submit expired, unclear, or uncertified copies.",
      consequences: "Your application will be flagged for verification issues, delayed, or outright rejected. This often happens when applicants rush to meet deadlines without double-checking their submission.",
      solution: "Create a checklist of all required documents before you start. Ensure you have: certified copy of your South African ID (certified within the last 3 months), proof of income for all household members, consent forms signed by parents/guardians, proof of registration or conditional acceptance letter, and bank statements where applicable. Scan documents clearly and ensure all text is legible.",
    },
    {
      number: 2,
      title: "Misreporting Household Income",
      description: "Many applicants either overstate or understate their household income. Some do this intentionally, hoping to improve their chances, while others simply make calculation errors or misunderstand what counts as 'income.'",
      consequences: "NSFAS cross-references your income declaration with SARS records and the UIF database. Discrepancies lead to automatic flagging, and false declarations can result in permanent disqualification and legal consequences.",
      solution: "Include all sources of income: salaries, pensions, grants, rental income, and informal income. If parents are unemployed, provide affidavits from the SAPS or a commissioner of oaths. If you receive SASSA grants, include proof as this can support your application. When in doubt, it's better to be transparent—NSFAS has mechanisms to verify and will investigate discrepancies.",
    },
    {
      number: 3,
      title: "Missing the Application Deadline",
      description: "NSFAS has strict application windows, typically opening in September and closing in November for the following academic year. Late applications are generally not accepted, regardless of circumstances.",
      consequences: "Missing the deadline means waiting an entire year to apply again. During this time, you may have to defer your studies or seek alternative, often more expensive, funding options.",
      solution: "Mark the NSFAS application dates in your calendar months in advance. Set reminders one month, two weeks, and one week before the deadline. Start your application early—don't wait until the last week. The system often experiences high traffic near closing dates, which can cause technical issues. Complete your application at least three days before the deadline to allow time for troubleshooting.",
    },
    {
      number: 4,
      title: "Using Incorrect Contact Information",
      description: "Providing wrong or outdated phone numbers, email addresses, or physical addresses is surprisingly common. Some applicants use relatives' details without their knowledge, or provide old contact information they no longer have access to.",
      consequences: "NSFAS communicates important updates, verification requests, and funding decisions via SMS and email. If they can't reach you, your application may be cancelled, or you'll miss crucial steps in the process.",
      solution: "Use your own, active cellphone number and email address. If you don't have an email, create a free Gmail or Outlook account specifically for your NSFAS communications. Check these regularly—at least twice a week during the application period. Ensure your physical address is current for any correspondence that may be posted.",
    },
    {
      number: 5,
      title: "Not Linking SASSA Status Correctly",
      description: "If your household receives SASSA grants, this information should ideally be linked to your NSFAS application as it supports your income status. Many applicants either fail to mention SASSA grants or don't know how to properly declare them.",
      consequences: "Failure to link SASSA information means NSFAS cannot automatically verify your household's low-income status, potentially leading to additional verification delays or rejection.",
      solution: "When completing your application, accurately indicate whether any household member receives SASSA grants. Have SASSA grant reference numbers available. If you're a SASSA beneficiary yourself, ensure your ID number matches across both systems. The integration between NSFAS and SASSA should work automatically if your details are consistent.",
    },
  ];

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
            <span className="text-foreground">NSFAS Application Mistakes</span>
          </div>
        </div>
      </div>

      {/* Article Header */}
      <article className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Badge variant="secondary">Education</Badge>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="w-4 h-4" />
                8 min read
              </span>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                January 2026
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              5 Common Mistakes to Avoid on Your NSFAS Application
            </h1>

            {/* Intro */}
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              The National Student Financial Aid Scheme (NSFAS) provides crucial funding for thousands of South African students each year. However, many applications are rejected due to avoidable errors. This guide identifies the most common mistakes and shows you exactly how to avoid them.
            </p>

            {/* Featured Image Placeholder */}
            <div className="w-full h-64 md:h-80 bg-gradient-hero rounded-xl mb-10 flex items-center justify-center">
              <GraduationCap className="w-20 h-20 text-white/50" />
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              
              <Card className="p-6 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800 mb-8">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Why This Matters</h3>
                    <p className="text-muted-foreground">
                      NSFAS receives over 1 million applications annually, but only a portion are successful. Many rejections are not due to ineligibility, but to preventable errors in the application process. By understanding these common pitfalls, you can significantly increase your chances of approval.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Mistakes List */}
              <div className="space-y-8 mb-10">
                {commonMistakes.map((mistake) => (
                  <Card key={mistake.number} className="p-6 overflow-hidden">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-red-600 dark:text-red-400 font-bold text-xl">{mistake.number}</span>
                      </div>
                      <div className="flex-1">
                        <h2 className="text-xl font-bold mb-3">{mistake.title}</h2>
                        
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide mb-2">The Problem</h4>
                            <p className="text-muted-foreground">{mistake.description}</p>
                          </div>
                          
                          <div className="flex items-start gap-2 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                            <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-sm mb-1">Consequences</h4>
                              <p className="text-sm text-muted-foreground">{mistake.consequences}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-2 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-sm mb-1">How to Avoid It</h4>
                              <p className="text-sm text-muted-foreground">{mistake.solution}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Checklist Section */}
              <Card className="p-6 mb-8">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Complete NSFAS Application Checklist
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Certified copy of South African ID (within 3 months)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Parent/guardian ID copies</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Proof of income (payslips, UIF, affidavit)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>SASSA grant confirmation (if applicable)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Death certificates (if parents deceased)</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Proof of registration or acceptance letter</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Grade 12 results (for first-time applicants)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Academic record (for returning students)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Signed consent form</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Active cellphone number and email address</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Pro Tips */}
              <Card className="p-6 bg-primary/5 border-primary/20 mb-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-primary" />
                  Pro Tips from Successful Applicants
                </h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                    <span><strong>Screenshot everything:</strong> Take screenshots of each page of your application and the confirmation at the end. This serves as proof of submission.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                    <span><strong>Apply from a stable internet connection:</strong> Avoid using public WiFi or mobile data with poor signal. A dropped connection during submission can cause issues.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                    <span><strong>Check your status weekly:</strong> Log in to the NSFAS portal regularly to check if any additional documents are requested or if there are status updates.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                    <span><strong>Use the NSFAS app:</strong> The myNSFAS app allows you to track your application status, receive notifications, and upload documents directly from your phone.</span>
                  </li>
                </ul>
              </Card>

              <div className="bg-gradient-hero rounded-xl p-8 text-white text-center">
                <h3 className="text-2xl font-bold mb-4">Need More Funding Options?</h3>
                <p className="text-white/90 mb-6 max-w-xl mx-auto">
                  Explore our comprehensive bursary database with over 200 funding opportunities from government, corporate, and private sources.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link to="/bursaries">
                    <Button size="lg" variant="secondary">
                      Browse Bursaries
                    </Button>
                  </Link>
                  <Link to="/nsfas">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                      NSFAS Guide
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

export default NsfasApplicationMistakes;
