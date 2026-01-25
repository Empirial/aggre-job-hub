import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  GraduationCap, 
  CheckCircle,
  ArrowLeft,
  Clock,
  Calendar,
  ExternalLink,
  Beaker,
  Cpu,
  Building,
  Calculator,
  MapPin
} from "lucide-react";
import { Link } from "react-router-dom";

const WesternCapeStemBursaries = () => {
  const bursaries = [
    {
      name: "Allan Gray Orbis Foundation Fellowship",
      provider: "Allan Gray Orbis Foundation",
      amount: "Full tuition + living expenses",
      eligibility: "Matric students with strong academics (70%+), leadership potential",
      fields: "Science, Technology, Engineering, Commerce",
      universities: "UCT, Stellenbosch, any SA university",
      deadline: "March 2026",
      link: "https://www.allangrayorbis.org",
      highlight: true,
    },
    {
      name: "Cape Town Science Centre STEM Bursary",
      provider: "Cape Town Science Centre",
      amount: "R50,000 - R80,000 per year",
      eligibility: "Western Cape residents, minimum 65% in Maths and Science",
      fields: "Physics, Chemistry, Biology, Computer Science",
      universities: "UCT, UWC, CPUT",
      deadline: "June 2026",
      link: "https://www.ctsc.org.za",
      highlight: false,
    },
    {
      name: "Sasol Bursary Programme",
      provider: "Sasol Limited",
      amount: "Full cost (tuition, accommodation, books, laptop)",
      eligibility: "SA citizens, 60%+ in Maths and Physical Science",
      fields: "Chemical, Mechanical, Electrical, Mining Engineering",
      universities: "Stellenbosch, UCT, CPUT",
      deadline: "May 2026",
      link: "https://www.sasol.com/careers/bursaries",
      highlight: true,
    },
    {
      name: "Eskom Bursary Scheme",
      provider: "Eskom Holdings",
      amount: "Full tuition + allowances",
      eligibility: "SA citizens, 60%+ in Maths and Science, financial need",
      fields: "Electrical, Mechanical, Civil Engineering, IT",
      universities: "UCT, CPUT, Stellenbosch",
      deadline: "September 2025",
      link: "https://www.eskom.co.za/careers",
      highlight: false,
    },
    {
      name: "Shoprite Bursary Programme",
      provider: "Shoprite Holdings",
      amount: "Full tuition + book allowance",
      eligibility: "SA citizens, academic merit, financial need",
      fields: "Information Technology, Data Science, Supply Chain",
      universities: "Stellenbosch, UCT, UWC",
      deadline: "October 2025",
      link: "https://www.shopriteholdings.co.za",
      highlight: false,
    },
    {
      name: "SKA SA Bursary Programme",
      provider: "Square Kilometre Array SA",
      amount: "Full funding + research opportunities",
      eligibility: "Honours students and above, focus on radio astronomy",
      fields: "Physics, Astrophysics, Engineering, Computer Science",
      universities: "UCT, Stellenbosch",
      deadline: "August 2025",
      link: "https://www.ska.ac.za",
      highlight: true,
    },
    {
      name: "Transnet Bursary Programme",
      provider: "Transnet SOC Ltd",
      amount: "Full tuition + laptop + vacation work",
      eligibility: "SA citizens, strong Maths and Science results",
      fields: "Civil, Electrical, Mechanical Engineering, IT",
      universities: "CPUT, UCT, Stellenbosch",
      deadline: "June 2026",
      link: "https://www.transnet.net",
      highlight: false,
    },
    {
      name: "NRF Postgraduate Bursary",
      provider: "National Research Foundation",
      amount: "R90,000 - R140,000 per year",
      eligibility: "Postgraduate students, research focus",
      fields: "All STEM disciplines",
      universities: "All SA universities",
      deadline: "Rolling applications",
      link: "https://www.nrf.ac.za",
      highlight: false,
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
            <span className="text-foreground">Western Cape STEM Bursaries</span>
          </div>
        </div>
      </div>

      <article className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Badge variant="secondary">Bursaries</Badge>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="w-4 h-4" />
                7 min read
              </span>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                January 2026
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              The Best Bursaries for STEM Students in the Western Cape
            </h1>

            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              The Western Cape is home to world-class universities and a thriving tech ecosystem. This curated guide highlights the best funding opportunities for students pursuing Science, Technology, Engineering, and Mathematics in the province.
            </p>

            <div className="w-full h-64 md:h-80 bg-gradient-hero rounded-xl mb-10 flex items-center justify-center">
              <GraduationCap className="w-20 h-20 text-white/50" />
            </div>

            <div className="prose prose-lg max-w-none">
              
              <h2 className="text-2xl font-bold mt-10 mb-4 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-primary" />
                Why Study STEM in the Western Cape?
              </h2>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                The Western Cape has emerged as South Africa's innovation capital. Cape Town's tech sector employs thousands and continues to grow, with major companies like Amazon, Takealot, and numerous startups establishing headquarters in the region. The Square Kilometre Array (SKA) project, renewable energy initiatives, and the biotech corridor around Stellenbosch create exceptional opportunities for STEM graduates.
              </p>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                Universities in the province—including the University of Cape Town (UCT), Stellenbosch University, University of the Western Cape (UWC), and Cape Peninsula University of Technology (CPUT)—offer internationally recognized STEM programmes with strong industry connections.
              </p>

              {/* STEM Categories */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                <Card className="p-4 text-center">
                  <Beaker className="w-10 h-10 mx-auto mb-2 text-primary" />
                  <h4 className="font-medium text-sm">Science</h4>
                  <p className="text-xs text-muted-foreground">Biology, Chemistry, Physics</p>
                </Card>
                <Card className="p-4 text-center">
                  <Cpu className="w-10 h-10 mx-auto mb-2 text-primary" />
                  <h4 className="font-medium text-sm">Technology</h4>
                  <p className="text-xs text-muted-foreground">IT, Data Science, Software</p>
                </Card>
                <Card className="p-4 text-center">
                  <Building className="w-10 h-10 mx-auto mb-2 text-primary" />
                  <h4 className="font-medium text-sm">Engineering</h4>
                  <p className="text-xs text-muted-foreground">Civil, Electrical, Mechanical</p>
                </Card>
                <Card className="p-4 text-center">
                  <Calculator className="w-10 h-10 mx-auto mb-2 text-primary" />
                  <h4 className="font-medium text-sm">Mathematics</h4>
                  <p className="text-xs text-muted-foreground">Statistics, Actuarial Science</p>
                </Card>
              </div>

              <h2 className="text-2xl font-bold mt-10 mb-6">Top STEM Bursaries for Western Cape Students</h2>

              <div className="space-y-6 mb-10">
                {bursaries.map((bursary, index) => (
                  <Card key={index} className={`p-6 ${bursary.highlight ? 'border-primary/50 bg-primary/5' : ''}`}>
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">{bursary.name}</h3>
                          {bursary.highlight && <Badge>Top Pick</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">{bursary.provider}</p>
                      </div>
                      <Badge variant="secondary" className="text-sm">{bursary.amount}</Badge>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="text-sm font-medium mb-1">Eligibility</h4>
                        <p className="text-sm text-muted-foreground">{bursary.eligibility}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1">Fields of Study</h4>
                        <p className="text-sm text-muted-foreground">{bursary.fields}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs">
                          <Calendar className="w-3 h-3 mr-1" />
                          Deadline: {bursary.deadline}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {bursary.universities}
                        </Badge>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href={bursary.link} target="_blank" rel="noopener noreferrer">
                          Apply Now
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              <h2 className="text-2xl font-bold mt-10 mb-4">Application Tips for STEM Bursaries</h2>

              <Card className="p-6 mb-8">
                <ul className="space-y-4 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Focus on Maths and Science Results</strong>
                      <p className="text-sm mt-1">Most STEM bursaries require a minimum of 60-70% in Mathematics and Physical Science. Aim higher to be competitive.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Highlight STEM Activities</strong>
                      <p className="text-sm mt-1">Include participation in science olympiads, coding clubs, robotics teams, or STEM-related volunteer work in your application.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Apply to Multiple Bursaries</strong>
                      <p className="text-sm mt-1">Don't rely on one application. Apply to at least 5-10 bursaries to maximize your chances.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Understand Work-Back Obligations</strong>
                      <p className="text-sm mt-1">Many corporate bursaries require you to work for the company after graduating. Factor this into your career planning.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Start Early</strong>
                      <p className="text-sm mt-1">Many bursary applications open 6-12 months before the academic year. Set calendar reminders for key deadlines.</p>
                    </div>
                  </li>
                </ul>
              </Card>

              <div className="bg-gradient-hero rounded-xl p-8 text-white text-center">
                <h3 className="text-2xl font-bold mb-4">Explore More Funding Options</h3>
                <p className="text-white/90 mb-6 max-w-xl mx-auto">
                  Browse our comprehensive bursary database with over 200 opportunities across all fields of study and provinces.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link to="/bursaries">
                    <Button size="lg" variant="secondary">
                      All Bursaries
                    </Button>
                  </Link>
                  <Link to="/stem-careers">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                      STEM Careers Guide
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

export default WesternCapeStemBursaries;
