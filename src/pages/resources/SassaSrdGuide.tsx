import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Briefcase, 
  CheckCircle,
  ArrowLeft,
  Clock,
  Calendar,
  AlertTriangle,
  Phone,
  FileText,
  CreditCard,
  XCircle,
  HelpCircle
} from "lucide-react";
import { Link } from "react-router-dom";

const SassaSrdGuide = () => {
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
            <span className="text-foreground">SASSA SRD Guide</span>
          </div>
        </div>
      </div>

      <article className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Badge variant="secondary">Social Grants</Badge>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="w-4 h-4" />
                9 min read
              </span>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                January 2026
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Navigating the SASSA SRD R370 Grant: Eligibility and Appeals Process
            </h1>

            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              The Social Relief of Distress (SRD) grant provides R370 monthly to unemployed South Africans. This comprehensive guide explains who qualifies, how to apply, check your status, and—critically—how to appeal if your application is declined.
            </p>

            <div className="w-full h-64 md:h-80 bg-gradient-hero rounded-xl mb-10 flex items-center justify-center">
              <CreditCard className="w-20 h-20 text-white/50" />
            </div>

            <div className="prose prose-lg max-w-none">
              
              <h2 className="text-2xl font-bold mt-10 mb-4 flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-primary" />
                What is the SRD R370 Grant?
              </h2>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                The Social Relief of Distress (SRD) grant was introduced during the COVID-19 pandemic to support unemployed South Africans who don't qualify for other social grants. Initially set at R350, the grant has been increased to R370 per month as of April 2024. The grant is administered by the South African Social Security Agency (SASSA) and is subject to monthly income and means testing.
              </p>

              <Card className="p-6 mb-8">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Eligibility Requirements
                </h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                    <span>Be a South African citizen, permanent resident, or refugee</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                    <span>Be aged between 18 and 60 years old</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                    <span>Be unemployed with no income or income below R625 per month</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                    <span>Not receive any other social grant or UIF payments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                    <span>Not be a registered student at an educational institution (unless also unemployed)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                    <span>Not be resident in a government-funded institution</span>
                  </li>
                </ul>
              </Card>

              <h2 className="text-2xl font-bold mt-10 mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-primary" />
                How to Apply for the SRD Grant
              </h2>

              <Card className="p-6 mb-6">
                <h4 className="font-semibold mb-4">Step-by-Step Application Process</h4>
                <ol className="space-y-4 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">1</span>
                    <div>
                      <strong>Visit the official SASSA website</strong>
                      <p className="text-sm mt-1">Go to <strong>srd.sassa.gov.za</strong>. This is the only official site. Beware of scam websites that look similar.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">2</span>
                    <div>
                      <strong>Enter your ID number</strong>
                      <p className="text-sm mt-1">Use your 13-digit South African ID number. The system will check if you've previously applied.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">3</span>
                    <div>
                      <strong>Verify your cellphone number</strong>
                      <p className="text-sm mt-1">You'll receive an OTP (One-Time Pin) via SMS. Enter it to continue. Ensure your number is active.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">4</span>
                    <div>
                      <strong>Confirm your personal details</strong>
                      <p className="text-sm mt-1">Verify your name, surname, and ID number are correct. These are pulled from the Department of Home Affairs database.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">5</span>
                    <div>
                      <strong>Submit banking details</strong>
                      <p className="text-sm mt-1">Provide your bank account details for payment. Or select a Cash Send or Post Office payment option if you don't have a bank account.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">6</span>
                    <div>
                      <strong>Accept the declaration</strong>
                      <p className="text-sm mt-1">Confirm that all information provided is true. False declarations can lead to disqualification and legal action.</p>
                    </div>
                  </li>
                </ol>
              </Card>

              <h2 className="text-2xl font-bold mt-10 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-yellow-500" />
                Common Reasons for Rejection
              </h2>

              <div className="space-y-4 mb-8">
                <Card className="p-5 border-l-4 border-l-red-500">
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold">Income Detected</h4>
                      <p className="text-sm text-muted-foreground">SASSA cross-checks with SARS, UIF, and company databases. Any income detected—even informal work—may disqualify you.</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-5 border-l-4 border-l-red-500">
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold">Receiving Another Grant</h4>
                      <p className="text-sm text-muted-foreground">If you receive any other SASSA grant (Child Support, Old Age Pension, etc.), you cannot receive the SRD grant simultaneously.</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-5 border-l-4 border-l-red-500">
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold">UIF Registration</h4>
                      <p className="text-sm text-muted-foreground">If you're registered as receiving UIF benefits, your application will be declined. Even if you've stopped receiving UIF, the system may not update immediately.</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-5 border-l-4 border-l-red-500">
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold">Bank Account Issues</h4>
                      <p className="text-sm text-muted-foreground">The bank account must be in your name. Joint accounts, business accounts, or accounts belonging to family members will not be accepted.</p>
                    </div>
                  </div>
                </Card>
              </div>

              <h2 className="text-2xl font-bold mt-10 mb-4 flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-primary" />
                How to Appeal a Declined Application
              </h2>

              <p className="text-muted-foreground mb-6">
                If your application is declined and you believe this is incorrect, you have the right to appeal. The appeal process is free and can be done online.
              </p>

              <Card className="p-6 bg-primary/5 border-primary/20 mb-8">
                <h4 className="font-semibold mb-4">Appeal Process Step-by-Step</h4>
                <ol className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="font-bold">1.</span>
                    <span>Go to <strong>srd.sassa.gov.za</strong> and click on "Check Status"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">2.</span>
                    <span>Enter your ID number and verify with OTP</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">3.</span>
                    <span>If declined, you'll see an "Appeal" button. Click it.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">4.</span>
                    <span>Select the reason for your appeal from the dropdown menu</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">5.</span>
                    <span>Provide detailed explanation and any supporting documents</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">6.</span>
                    <span>Submit and note your appeal reference number</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">7.</span>
                    <span>Appeals typically take 30-90 days to be reviewed</span>
                  </li>
                </ol>
              </Card>

              <Card className="p-6 mb-8">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-primary" />
                  SASSA Contact Information
                </h4>
                <ul className="text-muted-foreground space-y-2">
                  <li><strong>Toll-free helpline:</strong> 0800 60 10 11</li>
                  <li><strong>SRD status SMS:</strong> Send your ID number to 082 046 8553</li>
                  <li><strong>Email:</strong> grantenquiries@sassa.gov.za</li>
                  <li><strong>Website:</strong> www.sassa.gov.za</li>
                </ul>
              </Card>

              <div className="bg-gradient-hero rounded-xl p-8 text-white text-center">
                <h3 className="text-2xl font-bold mb-4">Looking for Employment?</h3>
                <p className="text-white/90 mb-6 max-w-xl mx-auto">
                  While waiting for your SASSA application, explore thousands of job opportunities on CareerGate. Many offer training and are specifically designed for unemployed youth.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link to="/jobs?category=learnerships">
                    <Button size="lg" variant="secondary">
                      Browse Learnerships
                    </Button>
                  </Link>
                  <Link to="/sassa-updates">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                      SASSA Updates
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

export default SassaSrdGuide;
