import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Phone, 
  MapPin,
  ExternalLink,
  Bell,
  CreditCard,
  FileText,
  Users
} from "lucide-react";
import { Link } from "react-router-dom";

const SassaUpdates = () => {
  const latestUpdates = [
    {
      title: "SRD R370 Grant Payment Dates for January 2026",
      date: "3 January 2026",
      type: "Payment",
      urgent: true,
      description: "SASSA has released the payment schedule for the R370 Social Relief of Distress grant. Payments will be processed from 15-31 January 2026 based on your ID number.",
    },
    {
      title: "SASSA Online Applications Now Open for 2026",
      date: "2 January 2026",
      type: "Application",
      urgent: false,
      description: "New applications for all SASSA grants are now being accepted for the 2026 cycle. Apply online or visit your nearest SASSA office.",
    },
    {
      title: "Child Support Grant Increase Confirmed",
      date: "28 December 2025",
      type: "Announcement",
      urgent: false,
      description: "The Child Support Grant will increase from R530 to R550 per child per month starting April 2026.",
    },
    {
      title: "SRD Status Check: New SMS Service",
      date: "20 December 2025",
      type: "Service",
      urgent: false,
      description: "Check your SRD application status by sending your ID number to 082 046 8553. Standard SMS rates apply.",
    },
  ];

  const grantTypes = [
    {
      name: "SRD Grant (R370)",
      description: "Social Relief of Distress grant for unemployed individuals aged 18-60",
      eligibility: "South African citizen, no income, not receiving any other social grant",
      amount: "R370 per month",
      icon: CreditCard,
    },
    {
      name: "Child Support Grant",
      description: "Monthly grant for primary caregivers of children under 18",
      eligibility: "Primary caregiver earning less than R5,600/month (single) or R11,200 (married)",
      amount: "R530 per child per month",
      icon: Users,
    },
    {
      name: "Old Age Pension",
      description: "Monthly pension for elderly South Africans",
      eligibility: "South African citizen aged 60 or older",
      amount: "R2,180 per month (R2,200 for 75+)",
      icon: Users,
    },
    {
      name: "Disability Grant",
      description: "Monthly grant for people with disabilities",
      eligibility: "South African citizen with a disability preventing employment",
      amount: "R2,180 per month",
      icon: FileText,
    },
  ];

  const paymentDates = [
    { grant: "Old Age Pension", date: "3 January 2026" },
    { grant: "Disability Grant", date: "4 January 2026" },
    { grant: "Child Support Grant", date: "5 January 2026" },
    { grant: "Foster Care Grant", date: "5 January 2026" },
    { grant: "SRD R370 Grant", date: "15-31 January 2026" },
  ];

  const faqItems = [
    {
      question: "How do I check my SASSA application status?",
      answer: "Visit srd.sassa.gov.za and enter your ID number, or SMS your ID to 082 046 8553. You can also call the SASSA helpline at 0800 60 10 11.",
    },
    {
      question: "Why was my SRD application declined?",
      answer: "Common reasons include: receiving other government assistance, having income detected, failed bank verification, or not meeting age requirements. You can appeal within 30 days.",
    },
    {
      question: "How do I update my banking details for SASSA?",
      answer: "Update your banking details at srd.sassa.gov.za using your ID number and cellphone number. Changes take 24-48 hours to process.",
    },
    {
      question: "Can I apply for multiple SASSA grants?",
      answer: "You can only receive one social grant at a time, except the Child Support Grant which can be combined with other grants.",
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
              <Bell className="w-3 h-3 mr-1" />
              Updated Daily
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              SASSA Updates & Grant Information
            </h1>
            <p className="text-xl text-white/90">
              Stay informed about SASSA payment dates, application status, and the latest news about social grants in South Africa.
            </p>
          </div>
        </div>
      </section>

      {/* Latest Updates */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Latest Updates</h2>
          <div className="space-y-4">
            {latestUpdates.map((update, index) => (
              <Card key={index} className={`p-5 ${update.urgent ? 'border-l-4 border-l-red-500' : ''}`}>
                <div className="flex flex-wrap items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {update.urgent && (
                        <Badge variant="destructive" className="text-xs">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Urgent
                        </Badge>
                      )}
                      <Badge variant="outline">{update.type}</Badge>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {update.date}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{update.title}</h3>
                    <p className="text-muted-foreground">{update.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Dates */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">January 2026 Payment Dates</h2>
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paymentDates.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-background rounded-lg">
                  <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                  <div>
                    <div className="font-medium">{item.grant}</div>
                    <div className="text-sm text-muted-foreground">{item.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* Grant Types */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Types of SASSA Grants</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {grantTypes.map((grant, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <grant.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{grant.name}</h3>
                    <Badge variant="secondary" className="mb-2">{grant.amount}</Badge>
                    <p className="text-muted-foreground text-sm mb-2">{grant.description}</p>
                    <p className="text-xs text-muted-foreground">
                      <strong>Eligibility:</strong> {grant.eligibility}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How to Apply */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">How to Apply for SASSA Grants</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                1
              </div>
              <h3 className="font-semibold text-lg mb-2">Online Application</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Visit srd.sassa.gov.za to apply for the SRD grant online. You'll need your ID number and cellphone.
              </p>
              <Button variant="outline" asChild>
                <a href="https://srd.sassa.gov.za" target="_blank" rel="noopener noreferrer">
                  Apply Online <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </Card>
            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                2
              </div>
              <h3 className="font-semibold text-lg mb-2">Visit SASSA Office</h3>
              <p className="text-muted-foreground text-sm mb-4">
                For other grants, visit your nearest SASSA office with your ID, proof of residence, and relevant documents.
              </p>
              <Button variant="outline" asChild>
                <a href="https://www.sassa.gov.za/Pages/Contact-Us.aspx" target="_blank" rel="noopener noreferrer">
                  Find Office <MapPin className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </Card>
            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                3
              </div>
              <h3 className="font-semibold text-lg mb-2">Call SASSA Helpline</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Call the toll-free SASSA helpline for assistance with applications, status checks, or queries.
              </p>
              <Button variant="outline" asChild>
                <a href="tel:0800601011">
                  <Phone className="w-4 h-4 mr-2" /> 0800 60 10 11
                </a>
              </Button>
            </Card>
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
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  {faq.question}
                </h3>
                <p className="text-muted-foreground ml-7">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Looking for Employment?
          </h2>
          <p className="text-white/90 mb-6 max-w-xl mx-auto">
            While waiting for your SASSA grant, explore thousands of job opportunities, learnerships, and internships across South Africa.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/jobs?category=government">
              <Button size="lg" variant="secondary">
                Government Jobs
              </Button>
            </Link>
            <Link to="/jobs?category=learnerships">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Learnerships
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SassaUpdates;
