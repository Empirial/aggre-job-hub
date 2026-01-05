import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  GraduationCap, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Phone, 
  Globe,
  ExternalLink,
  AlertCircle,
  FileText,
  CreditCard,
  Home,
  BookOpen,
  Laptop
} from "lucide-react";
import { Link } from "react-router-dom";

const Nsfas = () => {
  const allowances = [
    { name: "Tuition Fees", amount: "Up to R98,000", description: "Covers full tuition at public universities", icon: GraduationCap },
    { name: "Accommodation", amount: "Up to R45,000", description: "For accredited student accommodation", icon: Home },
    { name: "Living Allowance", amount: "R15,000/year", description: "Monthly payments for food and essentials", icon: CreditCard },
    { name: "Book Allowance", amount: "R5,460/year", description: "For textbooks and study materials", icon: BookOpen },
    { name: "Transport Allowance", amount: "R7,500/year", description: "For students not in residence", icon: CreditCard },
    { name: "Personal Care", amount: "R2,900/year", description: "For personal hygiene and care items", icon: CreditCard },
    { name: "Laptop Allowance", amount: "Once-off R5,200", description: "For first-year students only", icon: Laptop },
  ];

  const eligibilityRequirements = [
    { requirement: "South African citizen", included: true },
    { requirement: "Household income below R350,000 per year", included: true },
    { requirement: "Registered at a public university or TVET college", included: true },
    { requirement: "Not older than 35 years (for new applicants)", included: true },
    { requirement: "Studying towards first undergraduate qualification", included: true },
    { requirement: "Already have a degree or diploma", included: false },
    { requirement: "Studying at a private institution", included: false },
    { requirement: "Household income above R350,000", included: false },
  ];

  const applicationSteps = [
    {
      step: 1,
      title: "Create myNSFAS Account",
      description: "Visit my.nsfas.org.za and create your account using your ID number and email address.",
    },
    {
      step: 2,
      title: "Complete Application Form",
      description: "Fill in your personal details, academic information, and household income details accurately.",
    },
    {
      step: 3,
      title: "Upload Supporting Documents",
      description: "Upload certified copy of ID, proof of income, and academic records.",
    },
    {
      step: 4,
      title: "Submit and Track",
      description: "Submit your application and track your status online using your reference number.",
    },
  ];

  const importantDates = [
    { event: "2026 Applications Open", date: "1 August 2025" },
    { event: "Applications Close", date: "30 November 2025" },
    { event: "Results Released", date: "January 2026" },
    { event: "Appeals Deadline", date: "28 February 2026" },
  ];

  const statusMeanings = [
    { status: "Provisionally Funded", color: "bg-yellow-100 text-yellow-800", meaning: "Your application is approved pending registration confirmation" },
    { status: "Funded", color: "bg-green-100 text-green-800", meaning: "You are fully funded and will receive allowances" },
    { status: "Not Funded - Income", color: "bg-red-100 text-red-800", meaning: "Household income exceeds R350,000 threshold" },
    { status: "Awaiting Documents", color: "bg-blue-100 text-blue-800", meaning: "Additional documents required - check your portal" },
    { status: "Under Review", color: "bg-purple-100 text-purple-800", meaning: "Your application is being processed" },
  ];

  const faqItems = [
    {
      question: "Does NSFAS cover postgraduate studies?",
      answer: "No, NSFAS only funds undergraduate qualifications. For postgraduate funding, explore NRF bursaries or other options.",
    },
    {
      question: "Can I apply if I failed subjects?",
      answer: "Yes, but you must meet the N+2 rule (complete your qualification within the minimum time plus 2 years). Repeated failures may affect funding.",
    },
    {
      question: "How do I receive my allowances?",
      answer: "Allowances are paid directly to your NSFAS wallet, which you can access via the NSFAS app or USSD *120*176#.",
    },
    {
      question: "Can I change my institution after funding?",
      answer: "Yes, but you must inform NSFAS and your institution. The new institution must also be public and approve your transfer.",
    },
    {
      question: "What happens if my application is rejected?",
      answer: "You can appeal within 30 days by logging into myNSFAS and submitting an appeal with supporting documents.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              <GraduationCap className="w-3 h-3 mr-1" />
              Government Funding
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              NSFAS - National Student Financial Aid Scheme
            </h1>
            <p className="text-xl text-white/90 mb-6">
              Free higher education funding for qualifying South African students. Apply for 2026 now!
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" variant="secondary" asChild>
                <a href="https://my.nsfas.org.za" target="_blank" rel="noopener noreferrer">
                  Apply Now <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                <a href="https://my.nsfas.org.za" target="_blank" rel="noopener noreferrer">
                  Check Status
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Important Dates */}
      <section className="py-8 bg-yellow-50 border-y border-yellow-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="text-yellow-600" />
            <h2 className="font-bold text-lg">Important 2026 Dates</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {importantDates.map((item, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-yellow-200">
                <div className="font-bold text-primary">{item.date}</div>
                <div className="text-sm text-muted-foreground">{item.event}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Who Qualifies for NSFAS?</h2>
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {eligibilityRequirements.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  {item.included ? (
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  )}
                  <span className={item.included ? "" : "text-muted-foreground line-through"}>
                    {item.requirement}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* What NSFAS Covers */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-2">What Does NSFAS Cover?</h2>
          <p className="text-muted-foreground mb-6">NSFAS funding covers all your study-related expenses</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {allowances.map((item, index) => (
              <Card key={index} className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="font-semibold">{item.name}</div>
                </div>
                <div className="text-2xl font-bold text-primary mb-1">{item.amount}</div>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How to Apply */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">How to Apply for NSFAS</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {applicationSteps.map((item) => (
              <Card key={item.step} className="p-6 text-center relative">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </Card>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button size="lg" asChild>
              <a href="https://my.nsfas.org.za" target="_blank" rel="noopener noreferrer">
                Start Your Application <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Status Meanings */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Understanding Your NSFAS Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {statusMeanings.map((item, index) => (
              <Card key={index} className="p-5">
                <Badge className={`mb-3 ${item.color}`}>{item.status}</Badge>
                <p className="text-sm text-muted-foreground">{item.meaning}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqItems.map((faq, index) => (
              <Card key={index} className="p-5">
                <h3 className="font-semibold mb-2 flex items-start gap-2">
                  <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  {faq.question}
                </h3>
                <p className="text-muted-foreground ml-7">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Need Help?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <Phone className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Call Centre</h3>
              <p className="text-muted-foreground text-sm mb-3">Mon-Fri: 8am - 5pm</p>
              <Button variant="outline" asChild>
                <a href="tel:0800067327">0800 067 327</a>
              </Button>
            </Card>
            <Card className="p-6 text-center">
              <Globe className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Online Portal</h3>
              <p className="text-muted-foreground text-sm mb-3">Apply and check status</p>
              <Button variant="outline" asChild>
                <a href="https://my.nsfas.org.za" target="_blank" rel="noopener noreferrer">
                  my.nsfas.org.za
                </a>
              </Button>
            </Card>
            <Card className="p-6 text-center">
              <Clock className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">USSD</h3>
              <p className="text-muted-foreground text-sm mb-3">Check status on your phone</p>
              <Button variant="outline" asChild>
                <a href="tel:*120*176#">*120*176#</a>
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Explore Other Funding Options
          </h2>
          <p className="text-white/90 mb-6 max-w-xl mx-auto">
            Don't qualify for NSFAS? There are hundreds of bursaries and scholarships available from corporate and private sponsors.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/bursaries">
              <Button size="lg" variant="secondary">
                Browse Bursaries
              </Button>
            </Link>
            <Link to="/universities">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                View Universities
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Nsfas;
