import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/SearchBar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, 
  Building2, 
  TrendingUp, 
  Users, 
  MapPin, 
  ArrowRight, 
  GraduationCap,
  Star,
  Quote,
  Code,
  Cpu,
  Microscope,
  Calculator,
  ExternalLink,
  Clock,
  DollarSign,
  Shield,
  CheckCircle,
  BookOpen,
  Heart,
  Globe,
  Award,
  Target,
  Lightbulb,
  FileText,
  Wrench,
  Stethoscope,
  Scale,
  Truck,
  Palette,
  Megaphone,
  Factory
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const handleSearch = (keywords: string, location: string) => {
    navigate('/jobs', { state: { keywords, location } });
  };

  const categories = [
    { name: "Technology & IT", count: "8,500+", icon: Code, description: "Software development, data science, cybersecurity, and IT support roles" },
    { name: "Engineering", count: "5,200+", icon: Wrench, description: "Civil, mechanical, electrical, and mining engineering positions" },
    { name: "Healthcare", count: "4,800+", icon: Stethoscope, description: "Nursing, medical, pharmaceutical, and allied health careers" },
    { name: "Finance & Banking", count: "6,100+", icon: Building2, description: "Accounting, banking, investment, and financial services" },
    { name: "Sales & Marketing", count: "7,300+", icon: Megaphone, description: "Sales, digital marketing, brand management, and communications" },
    { name: "Manufacturing", count: "3,900+", icon: Factory, description: "Production, quality control, and operations management" },
    { name: "Legal", count: "2,100+", icon: Scale, description: "Attorneys, legal advisors, paralegals, and compliance officers" },
    { name: "Creative & Design", count: "2,800+", icon: Palette, description: "Graphic design, UX/UI, content creation, and media" },
  ];

  const locations = [
    { city: "Johannesburg", jobs: "18,500+", province: "Gauteng", highlight: "Business capital with most job opportunities" },
    { city: "Cape Town", jobs: "12,800+", province: "Western Cape", highlight: "Tech hub and tourism industry center" },
    { city: "Durban", jobs: "6,200+", province: "KwaZulu-Natal", highlight: "Port city with manufacturing focus" },
    { city: "Pretoria", jobs: "5,900+", province: "Gauteng", highlight: "Government and administrative hub" },
    { city: "Remote", jobs: "15,600+", province: "Nationwide", highlight: "Work from anywhere opportunities" },
    { city: "Port Elizabeth", jobs: "2,400+", province: "Eastern Cape", highlight: "Automotive and manufacturing sector" },
  ];

  const urgentUpdates = [
    { title: "SASSA SRD R350 Payment Dates for January 2026", type: "Grant" },
    { title: "DPSA Circular 01 of 2026: New Government Vacancies", type: "Government" },
    { title: "Transnet Graduate Programme 2026 Now Open", type: "Learnership" },
  ];

  const jobsByProvince = [
    { province: "Gauteng", jobs: "18,500+", cities: "Johannesburg, Pretoria, Soweto" },
    { province: "Western Cape", jobs: "12,800+", cities: "Cape Town, Stellenbosch, Paarl" },
    { province: "KwaZulu-Natal", jobs: "6,200+", cities: "Durban, Pietermaritzburg, Richards Bay" },
    { province: "Eastern Cape", jobs: "3,400+", cities: "Port Elizabeth, East London, Mthatha" },
    { province: "Free State", jobs: "2,100+", cities: "Bloemfontein, Welkom, Kroonstad" },
    { province: "Limpopo", jobs: "2,800+", cities: "Polokwane, Tzaneen, Mokopane" },
    { province: "Mpumalanga", jobs: "2,300+", cities: "Nelspruit, Witbank, Secunda" },
    { province: "North West", jobs: "1,900+", cities: "Rustenburg, Mahikeng, Klerksdorp" },
    { province: "Northern Cape", jobs: "1,200+", cities: "Kimberley, Upington, Springbok" },
  ];

  const featuredBursaries = [
    {
      name: "NSFAS Bursary",
      provider: "Dept of Higher Education",
      deadline: "Nov 2025",
      covers: ["Tuition", "Accommodation", "Books", "Living Allowance"],
      type: "Government",
      description: "South Africa's largest government funding scheme covering all costs for qualifying students at public universities and TVET colleges.",
    },
    {
      name: "Sasol Bursary",
      provider: "Sasol Limited",
      deadline: "May 2025",
      covers: ["Full Tuition", "Accommodation", "Laptop", "Vacation Work"],
      type: "Corporate",
      description: "One of SA's most prestigious bursaries for engineering students with guaranteed employment upon graduation.",
    },
    {
      name: "Allan Gray Fellowship",
      provider: "Allan Gray Foundation",
      deadline: "Feb 2025",
      covers: ["Full Funding", "Mentorship", "Startup Capital", "Network Access"],
      type: "Private",
      description: "Not just a bursary but a fellowship that develops future entrepreneurs with mentorship and startup funding.",
    },
  ];

  const stemSpotlight = [
    {
      title: "Software Developer",
      icon: Code,
      salary: "R250K - R900K",
      demand: "Very High",
      description: "Build applications and systems that power businesses. Entry-level developers can earn R20k/month, seniors R75k+. Remote work common.",
      growth: "+25% jobs yearly",
    },
    {
      title: "Data Scientist",
      icon: Cpu,
      salary: "R350K - R1.2M",
      demand: "Very High",
      description: "Analyze data to drive business decisions. One of the fastest-growing careers in SA with shortage of skilled professionals.",
      growth: "+35% jobs yearly",
    },
    {
      title: "Biomedical Scientist",
      icon: Microscope,
      salary: "R280K - R650K",
      demand: "High",
      description: "Research diseases and develop treatments. COVID highlighted the critical need for medical researchers in South Africa.",
      growth: "+15% jobs yearly",
    },
    {
      title: "Actuary",
      icon: Calculator,
      salary: "R500K - R2M+",
      demand: "High",
      description: "Use mathematics to assess risk. One of the highest-paying professions in SA, though qualification takes 8-10 years.",
      growth: "+10% jobs yearly",
    },
  ];

  const impactStats = [
    { value: "50K+", label: "Jobs Listed", description: "Updated daily from verified employers across SA" },
    { value: "200+", label: "Bursaries", description: "Government, corporate, and private funding options" },
    { value: "100K+", label: "Monthly Users", description: "Job seekers and students finding opportunities" },
    { value: "9", label: "Provinces Covered", description: "Opportunities in every corner of South Africa" },
  ];

  const whyCareerGate = [
    {
      icon: Shield,
      title: "Verified Listings",
      description: "Every job and bursary is verified. We remove scam listings within 24 hours to protect you from fraud.",
    },
    {
      icon: Globe,
      title: "Completely Free",
      description: "No registration fees, no premium memberships. All information is free for all South Africans.",
    },
    {
      icon: Target,
      title: "South African Focus",
      description: "Built specifically for SA job seekers with local companies, local salaries, and local opportunities.",
    },
    {
      icon: BookOpen,
      title: "Career Resources",
      description: "Beyond jobs: CV templates, interview tips, salary guides, and STEM career information.",
    },
  ];

  const recentSuccessStories = [
    { province: "Gauteng", placed: "2,450", sector: "Finance & IT" },
    { province: "Western Cape", placed: "1,890", sector: "Tourism & Tech" },
    { province: "KwaZulu-Natal", placed: "1,230", sector: "Healthcare" },
    { province: "Limpopo", placed: "680", sector: "Mining & Agriculture" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Section - Enhanced */}
      <section className="relative overflow-hidden bg-gradient-hero py-24 md:py-36">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
              🎉 Over 50,000 jobs listed this month
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Find Your Dream Job in South Africa Today
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-4 max-w-3xl mx-auto">
              Discover thousands of opportunities from top companies across all 9 provinces. From entry-level to executive positions, we have jobs for everyone.
            </p>
            <p className="text-lg text-white/80 mb-8">
              Plus access to 200+ bursaries and scholarships for students
            </p>
          </div>
          <SearchBar variant="hero" onSearch={handleSearch} />
          <div className="mt-8 text-center">
            <p className="text-white/80 mb-4">
              Popular searches:{" "}
              <span className="text-white font-medium hover:underline cursor-pointer">Software Developer</span>,{" "}
              <span className="text-white font-medium hover:underline cursor-pointer">Registered Nurse</span>,{" "}
              <span className="text-white font-medium hover:underline cursor-pointer">Accountant</span>,{" "}
              <span className="text-white font-medium hover:underline cursor-pointer">Civil Engineer</span>,{" "}
              <span className="text-white font-medium hover:underline cursor-pointer">Teacher</span>
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <Badge variant="outline" className="border-white/40 text-white hover:bg-white/10">Remote Jobs</Badge>
              <Badge variant="outline" className="border-white/40 text-white hover:bg-white/10">Government Jobs</Badge>
              <Badge variant="outline" className="border-white/40 text-white hover:bg-white/10">Graduate Programs</Badge>
              <Badge variant="outline" className="border-white/40 text-white hover:bg-white/10">Part-time</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Urgent Opportunities Feed */}
      <section className="py-8 bg-yellow-50 border-y border-yellow-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="text-red-600 animate-pulse" />
            <h2 className="text-xl font-bold uppercase tracking-tight">Urgent Opportunities</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {urgentUpdates.map((update, i) => (
              <Card key={i} className="p-4 border-l-4 border-l-red-600 hover:shadow-md cursor-pointer transition-all">
                <Badge variant="outline" className="mb-2 text-red-600 border-red-200">{update.type}</Badge>
                <h3 className="font-bold text-gray-900 leading-snug">{update.title}</h3>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats Bar - Enhanced */}
      <section className="bg-card border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {impactStats.map((stat) => (
              <div key={stat.label} className="space-y-2">
                <div className="text-4xl md:text-5xl font-bold text-primary">{stat.value}</div>
                <div className="text-lg font-semibold">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why CareerGate Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why South Africans Choose CareerGate</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're not just another job board. We're committed to helping every South African find opportunities, regardless of their background or location.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyCareerGate.map((item) => (
              <Card key={item.title} className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section - Enhanced */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Browse Jobs by Industry</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore opportunities across South Africa's major industries. From tech startups to mining giants, we have positions at every level.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link to="/jobs" key={category.name}>
                  <Card className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group h-full">
                    <div className="w-14 h-14 bg-gradient-hero rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                    <Badge variant="secondary" className="font-semibold">{category.count} jobs</Badge>
                  </Card>
                </Link>
              );
            })}
          </div>
          <div className="text-center mt-8">
            <Link to="/jobs">
              <Button size="lg" className="gap-2">
                View All Categories
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Bursaries Section - Enhanced */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="w-6 h-6 text-primary" />
                <span className="text-sm font-medium text-primary uppercase tracking-wide">Education Funding</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Featured Bursaries & Scholarships</h2>
              <p className="text-lg text-muted-foreground max-w-xl">
                Don't let finances stop your education. Access over R5 billion in available funding through our bursary database. Applications are often simpler than you think.
              </p>
            </div>
            <Link to="/bursaries" className="mt-4 md:mt-0">
              <Button variant="outline" className="gap-2">
                View All 200+ Bursaries
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredBursaries.map((bursary) => (
              <Card key={bursary.name} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <Badge variant={bursary.type === "Government" ? "default" : bursary.type === "Corporate" ? "secondary" : "outline"}>
                    {bursary.type}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {bursary.deadline}
                  </div>
                </div>
                <h3 className="font-semibold text-xl mb-1">{bursary.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{bursary.provider}</p>
                <p className="text-sm text-muted-foreground mb-4">{bursary.description}</p>
                <div className="flex flex-wrap gap-1">
                  {bursary.covers.map((item) => (
                    <Badge key={item} variant="outline" className="text-xs">
                      {item}
                    </Badge>
                  ))}
                </div>
              </Card>
            ))}
          </div>
          <div className="mt-8 bg-primary/5 rounded-lg p-6 text-center">
            <h3 className="font-semibold text-lg mb-2">Did You Know?</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Over R15 billion in bursary funding goes unclaimed each year in South Africa because students don't know these opportunities exist or miss application deadlines. We're here to change that.
            </p>
          </div>
        </div>
      </section>

      {/* STEM Career Spotlight - Enhanced */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Cpu className="w-6 h-6 text-primary" />
                <span className="text-sm font-medium text-primary uppercase tracking-wide">Career Guide</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">STEM Career Spotlight</h2>
              <p className="text-lg text-muted-foreground max-w-xl">
                South Africa has a critical shortage of STEM professionals. These high-demand careers offer excellent salaries, job security, and the chance to make a real impact. Many offer bursaries and study support.
              </p>
            </div>
            <Link to="/stem-careers" className="mt-4 md:mt-0">
              <Button variant="outline" className="gap-2">
                Explore All STEM Careers
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stemSpotlight.map((career) => (
              <Link to="/stem-careers" key={career.title}>
                <Card className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group h-full">
                  <div className="w-14 h-14 bg-gradient-hero rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <career.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{career.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{career.description}</p>
                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Salary Range:</span>
                      <span className="font-semibold text-primary">{career.salary}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Growth:</span>
                      <Badge variant={career.demand === "Very High" ? "default" : "secondary"} className="text-xs">
                        {career.growth}
                      </Badge>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Jobs by Province - Replaces Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Jobs by Province</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find opportunities in every corner of South Africa. Click on your province to see available jobs.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobsByProvince.map((item) => (
              <Link to={`/jobs?province=${item.province.toLowerCase().replace(' ', '-')}`} key={item.province}>
                <Card className="p-5 hover:shadow-lg transition-all cursor-pointer group border-l-4 border-l-primary">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{item.province}</h3>
                    <Badge variant="secondary" className="font-bold">{item.jobs}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.cities}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Locations Section - Enhanced */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Find Jobs Near You</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Opportunities exist in every province. Whether you're in a major city or a rural area, there are jobs and bursaries available for you.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {locations.map((location) => (
              <Card
                key={location.city}
                className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <MapPin className="w-8 h-8 text-secondary group-hover:scale-110 transition-transform" />
                  <Badge variant="outline">{location.province}</Badge>
                </div>
                <h3 className="font-semibold text-xl mb-1">{location.city}</h3>
                <p className="text-2xl font-bold text-primary mb-2">{location.jobs}</p>
                <p className="text-sm text-muted-foreground">{location.highlight}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How CareerGate Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Finding your next opportunity has never been easier. Here's how to get started in 3 simple steps.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                1
              </div>
              <h3 className="font-semibold text-xl mb-2">Search</h3>
              <p className="text-muted-foreground">
                Use our powerful search to find jobs or bursaries matching your skills, location, and interests. Filter by salary, industry, or job type.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                2
              </div>
              <h3 className="font-semibold text-xl mb-2">Apply</h3>
              <p className="text-muted-foreground">
                Click through to the employer's application page. Each listing includes clear instructions on how to apply, what documents you need, and deadlines.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                3
              </div>
              <h3 className="font-semibold text-xl mb-2">Succeed</h3>
              <p className="text-muted-foreground">
                Use our career resources to prepare for interviews and negotiate your salary. Then come back and share your success story to inspire others!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Placements by Province */}
      <section className="py-12 bg-card border-y">
        <div className="container mx-auto px-4">
          <h3 className="text-center font-semibold text-lg mb-6">This Month: Jobs Filled Through CareerGate</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recentSuccessStories.map((story) => (
              <div key={story.province} className="text-center p-4">
                <div className="text-2xl font-bold text-primary">{story.placed}</div>
                <div className="font-medium">{story.province}</div>
                <div className="text-sm text-muted-foreground">{story.sector}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section - Enhanced */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Your Future Starts Here
          </h2>
          <p className="text-xl text-white/90 mb-4 max-w-2xl mx-auto">
            Join over 100,000 South Africans who use CareerGate every month to find opportunities that change their lives.
          </p>
          <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
            Whether you're a matriculant looking for your first job, a student seeking bursary funding, or an experienced professional ready for a new challenge — we're here to help.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/jobs">
              <Button size="lg" variant="secondary" className="text-lg px-8 h-14">
                Browse All Jobs
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/bursaries">
              <Button size="lg" variant="outline" className="text-lg px-8 h-14 border-white text-white hover:bg-white/10">
                Find Bursaries
                <GraduationCap className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-white/80">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>100% Free</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>No Registration Required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>Updated Daily</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
