import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Heart, 
  Users, 
  GraduationCap, 
  Briefcase, 
  Shield,
  CheckCircle,
  Star
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Donate = () => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(100);
  const [customAmount, setCustomAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const donationTiers = [
    { amount: 50, label: "R50", impact: "Helps verify 10 job listings" },
    { amount: 100, label: "R100", impact: "Supports 1 student's bursary application" },
    { amount: 250, label: "R250", impact: "Provides career guidance to 5 job seekers" },
    { amount: 500, label: "R500", impact: "Funds STEM resources for 20 students" },
    { amount: 1000, label: "R1,000", impact: "Sponsors a month of free job listings" },
  ];

  const impactStats = [
    { icon: Users, value: "100,000+", label: "Job seekers helped monthly" },
    { icon: GraduationCap, value: "15,000+", label: "Students connected to bursaries" },
    { icon: Briefcase, value: "50,000+", label: "Jobs listed for free" },
    { icon: Shield, value: "5,000+", label: "Scam listings removed" },
  ];

  const handleDonate = async () => {
    const amount = selectedAmount || (customAmount ? parseInt(customAmount) : 0);
    
    if (amount < 10) {
      toast({
        title: "Minimum Donation",
        description: "The minimum donation amount is R10.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // For now, show a message that Yoco integration is pending
      toast({
        title: "Thank You!",
        description: "Yoco payment integration is being set up. Please contact us directly to donate.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-hero py-20">
          <div className="container mx-auto px-4 text-center">
            <Heart className="w-16 h-16 mx-auto mb-6 text-white" />
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Support Our Mission
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
              Your donation helps us keep JobFinder SA free for all South Africans. Every rand goes directly towards connecting job seekers with opportunities and students with bursaries.
            </p>
          </div>
        </section>

        {/* Impact Stats */}
        <section className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {impactStats.map((stat) => (
              <Card key={stat.label} className="p-4 text-center">
                <stat.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </Card>
            ))}
          </div>
        </section>

        {/* Donation Form */}
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6 text-center">Make a Donation</h2>
                
                {/* Amount Selection */}
                <div className="mb-6">
                  <Label className="text-base font-semibold mb-4 block">Select Amount</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                    {donationTiers.map((tier) => (
                      <button
                        key={tier.amount}
                        onClick={() => handleAmountSelect(tier.amount)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          selectedAmount === tier.amount
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="font-bold text-lg">{tier.label}</div>
                        <div className="text-xs text-muted-foreground mt-1">{tier.impact}</div>
                      </button>
                    ))}
                  </div>
                  
                  <div className="relative">
                    <Label htmlFor="customAmount" className="text-sm mb-2 block">Or enter custom amount</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R</span>
                      <Input
                        id="customAmount"
                        type="number"
                        placeholder="Enter amount"
                        value={customAmount}
                        onChange={(e) => handleCustomAmountChange(e.target.value)}
                        className="pl-8"
                        min="10"
                      />
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-muted/50 p-4 rounded-lg mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Donation Amount:</span>
                    <span className="text-xl font-bold text-primary">
                      R{selectedAmount || customAmount || 0}
                    </span>
                  </div>
                </div>

                {/* Donate Button */}
                <Button 
                  size="lg" 
                  className="w-full gap-2"
                  onClick={handleDonate}
                  disabled={isProcessing || (!selectedAmount && !customAmount)}
                >
                  <Heart className="w-5 h-5" />
                  {isProcessing ? "Processing..." : "Donate Now"}
                </Button>

                {/* Security Note */}
                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4" />
                  <span>Secure payment powered by Yoco</span>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Where Money Goes */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Where Your Donation Goes</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Job Verification (30%)</h3>
                    <p className="text-sm text-muted-foreground">
                      Our team manually reviews job listings to protect job seekers from scams and fraudulent employers.
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Bursary Research (25%)</h3>
                    <p className="text-sm text-muted-foreground">
                      Keeping our bursary database updated with accurate deadlines, requirements, and application links.
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Career Resources (25%)</h3>
                    <p className="text-sm text-muted-foreground">
                      Creating free CV templates, interview guides, and STEM career information for job seekers.
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Platform Operations (20%)</h3>
                    <p className="text-sm text-muted-foreground">
                      Server costs, maintenance, and development to keep the platform running smoothly and freely accessible.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Lives You've Changed</h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <Card className="p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "I found my first job through JobFinder SA after months of searching. The platform is easy to use and completely free. Thank you to everyone who supports this mission!"
                </p>
                <div className="font-medium">— Themba M., Soweto</div>
              </Card>
              <Card className="p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "The bursary information helped me find funding for my engineering degree. Without JobFinder SA, I might never have known about the Sasol bursary."
                </p>
                <div className="font-medium">— Naledi K., Pretoria</div>
              </Card>
              <Card className="p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "As a rural student, I had no idea what career paths were available. The STEM careers section opened my eyes to possibilities I never knew existed."
                </p>
                <div className="font-medium">— Sipho N., Limpopo</div>
              </Card>
            </div>
          </div>
        </section>

        {/* Other Ways to Help */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Other Ways to Help</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="p-6 text-center">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Share Our Platform</h3>
              <p className="text-sm text-muted-foreground">
                Tell friends, family, and colleagues about JobFinder SA. Every share helps someone find an opportunity.
              </p>
            </Card>
            <Card className="p-6 text-center">
              <Briefcase className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Partner With Us</h3>
              <p className="text-sm text-muted-foreground">
                Companies can list jobs for free and support our mission by sponsoring platform features.
              </p>
            </Card>
            <Card className="p-6 text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Volunteer</h3>
              <p className="text-sm text-muted-foreground">
                Help us review job listings, update bursary information, or provide career mentorship.
              </p>
            </Card>
          </div>
        </section>

        {/* Tax Deduction Note */}
        <section className="bg-gradient-hero py-12">
          <div className="container mx-auto px-4 text-center">
            <p className="text-white/90 max-w-2xl mx-auto">
              <strong className="text-white">Note:</strong> JobFinder SA is registered as a non-profit organization. Donations may be tax-deductible. A receipt will be provided for all donations over R100.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Donate;
