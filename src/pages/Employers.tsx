import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Target, Users, TrendingUp, Zap, CheckCircle } from "lucide-react";

const Employers = () => {
  const benefits = [
    {
      icon: Target,
      title: "Targeted Reach",
      description: "Your job postings reach thousands of qualified South African candidates actively seeking opportunities.",
    },
    {
      icon: Users,
      title: "Quality Candidates",
      description: "Access a pool of verified, skilled professionals across all industries and experience levels.",
    },
    {
      icon: TrendingUp,
      title: "Easy Management",
      description: "Simple dashboard to post, manage, and track all your job listings in one place.",
    },
    {
      icon: Zap,
      title: "Fast Results",
      description: "Get applications within hours of posting. Our platform ensures maximum visibility for your openings.",
    },
  ];

  const features = [
    "Unlimited job postings",
    "Featured listing options",
    "Applicant tracking system",
    "Company profile page",
    "Advanced candidate filtering",
    "Analytics and reporting",
    "Priority support",
    "Custom branding options",
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-hero py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Find Your Next Great Hire
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8">
              Connect with South Africa's top talent. Post your jobs and start receiving applications from qualified candidates today.
            </p>
            <Button size="lg" className="bg-white text-primary hover:bg-white/90">
              Post a Job Now
            </Button>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose JobFinder SA</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => (
              <Card key={benefit.title} className="p-6 text-center hover:shadow-lg transition-shadow">
                <benefit.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Everything You Need to Hire</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-2 text-center">Get Started Today</h2>
              <p className="text-muted-foreground text-center mb-6">
                Fill out the form below and our team will contact you within 24 hours to set up your employer account.
              </p>
              
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input id="companyName" placeholder="Your Company Ltd" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactName">Contact Name</Label>
                    <Input id="contactName" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Email</Label>
                    <Input id="contactEmail" type="email" placeholder="john@company.com" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="+27 11 123 4567" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Company Website (Optional)</Label>
                  <Input id="website" placeholder="https://www.yourcompany.co.za" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requirements">Tell us about your hiring needs</Label>
                  <Textarea 
                    id="requirements" 
                    placeholder="Number of positions, roles, urgency, etc..." 
                    className="min-h-[120px]"
                  />
                </div>

                <Button type="submit" size="lg" className="w-full">
                  Request Employer Access
                </Button>
              </form>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Employers;
