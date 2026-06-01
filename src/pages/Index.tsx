import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/SearchBar";
import {
  Building2,
  TrendingUp,
  MapPin,
  ArrowRight,
  Code,
  Cpu,
  Microscope,
  Calculator,
  Shield,
  CheckCircle,
  BookOpen,
  Globe,
  Target,
  Wrench,
  Stethoscope,
  Scale,
  Palette,
  Megaphone,
  Factory,
  ChevronRight,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const handleSearch = (keywords: string, location: string) => {
    navigate('/jobs', { state: { keywords, location } });
  };

  const categories = [
    { name: "Technology & IT", count: "8,500+", icon: Code, description: "Software, data science, cybersecurity" },
    { name: "Engineering", count: "5,200+", icon: Wrench, description: "Civil, mechanical, electrical, mining" },
    { name: "Healthcare", count: "4,800+", icon: Stethoscope, description: "Nursing, medical, pharmaceutical" },
    { name: "Finance & Banking", count: "6,100+", icon: Building2, description: "Accounting, banking, investment" },
    { name: "Sales & Marketing", count: "7,300+", icon: Megaphone, description: "Sales, digital marketing, brand" },
    { name: "Manufacturing", count: "3,900+", icon: Factory, description: "Production, quality, operations" },
    { name: "Legal", count: "2,100+", icon: Scale, description: "Attorneys, paralegals, compliance" },
    { name: "Creative & Design", count: "2,800+", icon: Palette, description: "Graphic design, UX/UI, media" },
  ];

  const locations = [
    { city: "Johannesburg", jobs: "18,500+", province: "Gauteng", highlight: "Business capital — most jobs" },
    { city: "Cape Town", jobs: "12,800+", province: "Western Cape", highlight: "Tech hub and tourism center" },
    { city: "Durban", jobs: "6,200+", province: "KwaZulu-Natal", highlight: "Port city — manufacturing focus" },
    { city: "Pretoria", jobs: "5,900+", province: "Gauteng", highlight: "Government and admin hub" },
    { city: "Remote", jobs: "15,600+", province: "Nationwide", highlight: "Work from anywhere" },
    { city: "Port Elizabeth", jobs: "2,400+", province: "Eastern Cape", highlight: "Automotive sector" },
  ];

  const urgentUpdates = [
    { title: "DPSA Circular 01 of 2026: New Government Vacancies", type: "Government" },
    { title: "Transnet Graduate Programme 2026 Now Open", type: "Learnership" },
    { title: "Top STEM Roles Hiring Across South Africa Right Now", type: "STEM" },
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

  const stemSpotlight = [
    {
      title: "Software Developer",
      icon: Code,
      salary: "R250K – R900K",
      demand: "Very High",
      description: "Build apps and systems powering SA businesses. Entry-level R20k/month, seniors R75k+.",
      growth: "+25% yearly",
    },
    {
      title: "Data Scientist",
      icon: Cpu,
      salary: "R350K – R1.2M",
      demand: "Very High",
      description: "Analyse data to drive decisions. Fastest-growing role with critical skill shortage in SA.",
      growth: "+35% yearly",
    },
    {
      title: "Biomedical Scientist",
      icon: Microscope,
      salary: "R280K – R650K",
      demand: "High",
      description: "Research diseases and develop treatments. Medical research demand growing post-COVID.",
      growth: "+15% yearly",
    },
    {
      title: "Actuary",
      icon: Calculator,
      salary: "R500K – R2M+",
      demand: "High",
      description: "Use mathematics to assess risk. One of the highest-paying professions in South Africa.",
      growth: "+10% yearly",
    },
  ];

  const impactStats = [
    { value: "50K+", label: "Jobs Listed", badge: "Updated daily" },
    { value: "8", label: "Industries", badge: "All sectors" },
    { value: "100K+", label: "Monthly Users", badge: "Growing fast" },
    { value: "9", label: "Provinces", badge: "Nationwide" },
  ];

  const whyCareerGate = [
    {
      icon: Shield,
      title: "Verified Listings",
      description: "Every listing is verified. Scam postings removed within 24 hours.",
    },
    {
      icon: Globe,
      title: "Completely Free",
      description: "No fees, no memberships. All information is free for all South Africans.",
    },
    {
      icon: Target,
      title: "South African Focus",
      description: "Built for SA job seekers with local companies, salaries, and opportunities.",
    },
    {
      icon: BookOpen,
      title: "Career Resources",
      description: "CV templates, interview tips, salary guides, and STEM career information.",
    },
  ];

  const recentSuccessStories = [
    { province: "Gauteng", placed: "2,450", sector: "Finance & IT" },
    { province: "Western Cape", placed: "1,890", sector: "Tourism & Tech" },
    { province: "KwaZulu-Natal", placed: "1,230", sector: "Healthcare" },
    { province: "Limpopo", placed: "680", sector: "Mining & Agriculture" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-24 md:py-36">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <span className="inline-block mb-6 px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-medium border border-white/30">
              Over 50,000 jobs listed this month
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Find Your Dream Job in South Africa Today
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-4 max-w-3xl mx-auto">
              Discover thousands of opportunities from top companies across all 9 provinces.
            </p>
          </div>
          <SearchBar variant="hero" onSearch={handleSearch} />
          <div className="mt-8 text-center">
            <p className="text-white/80 mb-4">
              Popular:{" "}
              {["Software Developer", "Registered Nurse", "Accountant", "Civil Engineer", "Teacher"].map((term, i, arr) => (
                <span key={term}>
                  <span className="text-white font-medium hover:underline cursor-pointer">{term}</span>
                  {i < arr.length - 1 && <span className="text-white/60">, </span>}
                </span>
              ))}
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {["Remote Jobs", "Government Jobs", "Graduate Programs", "Part-time"].map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full border border-white/40 text-white text-sm hover:bg-white/10 cursor-pointer transition-colors">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Urgent Opportunities */}
      <section className="py-6 bg-white border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-red-500" />
            <span className="text-sm font-semibold uppercase tracking-wide text-red-500">Urgent Opportunities</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {urgentUpdates.map((update, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-red-50 border border-red-100 cursor-pointer hover:border-red-200 transition-colors group">
                <div className="flex-1">
                  <span className="inline-block px-2 py-0.5 rounded-md bg-red-100 text-red-600 text-xs font-medium mb-1.5">{update.type}</span>
                  <p className="text-sm font-semibold text-foreground leading-snug group-hover:text-red-700 transition-colors">{update.title}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats — DealDeck card style */}
      <section className="py-10 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {impactStats.map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl p-6 border border-border shadow-sm">
                <p className="text-3xl md:text-4xl font-bold text-foreground mb-1">{stat.value}</p>
                <p className="text-sm font-semibold text-foreground mb-2">{stat.label}</p>
                <span className="inline-block px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-medium">
                  {stat.badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why CareerGate */}
      <section className="py-16 bg-white border-y border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Why South Africans Choose CareerGate</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm">
              Not just another job board — committed to helping every South African find opportunity.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {whyCareerGate.map((item) => (
              <div key={item.title} className="bg-background rounded-2xl p-6 border border-border hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Industry */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-1">Browse by Industry</h2>
              <p className="text-muted-foreground text-sm">Positions at every level across SA's major sectors</p>
            </div>
            <Link to="/jobs" className="hidden md:flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link to="/jobs" key={category.name}>
                  <div className="bg-white rounded-2xl p-5 border border-border hover:shadow-md transition-all duration-200 cursor-pointer group h-full">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="font-semibold mb-1">{category.name}</h3>
                    <p className="text-xs text-muted-foreground mb-3">{category.description}</p>
                    <span className="inline-block px-2.5 py-0.5 rounded-lg bg-muted text-muted-foreground text-xs font-medium">
                      {category.count} jobs
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="mt-6 md:hidden text-center">
            <Link to="/jobs">
              <Button size="sm" className="gap-2">View All Categories <ArrowRight className="w-4 h-4" /></Button>
            </Link>
          </div>
        </div>
      </section>

      {/* STEM Career Spotlight */}
      <section className="py-16 bg-white border-y border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Cpu className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-primary uppercase tracking-wide">Career Guide</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-1">STEM Career Spotlight</h2>
              <p className="text-muted-foreground text-sm max-w-xl">
                SA has a critical shortage of STEM professionals. High-demand roles with excellent salaries.
              </p>
            </div>
            <Link to="/stem-careers" className="mt-4 md:mt-0 hidden md:flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              Explore all STEM careers <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stemSpotlight.map((career) => (
              <Link to="/stem-careers" key={career.title}>
                <div className="bg-background rounded-2xl p-5 border border-border hover:shadow-md transition-all duration-200 cursor-pointer group h-full">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                    <career.icon className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-semibold mb-1">{career.title}</h3>
                  <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{career.description}</p>
                  <div className="space-y-1.5 pt-3 border-t border-border">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Salary</span>
                      <span className="text-xs font-semibold text-primary">{career.salary}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Growth</span>
                      <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-xs font-semibold">
                        {career.growth}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Jobs by Province */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-1">Jobs by Province</h2>
            <p className="text-muted-foreground text-sm">Find opportunities in every corner of South Africa</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {jobsByProvince.map((item) => (
              <Link to={`/jobs?province=${item.province.toLowerCase().replace(' ', '-')}`} key={item.province}>
                <div className="bg-white rounded-2xl p-5 border border-border hover:shadow-md transition-all cursor-pointer group flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold group-hover:text-primary transition-colors">{item.province}</h3>
                    <p className="text-xs text-muted-foreground truncate">{item.cities}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="inline-block px-2.5 py-0.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold">
                      {item.jobs}
                    </span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Find Jobs Near You */}
      <section className="py-16 bg-white border-y border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-1">Find Jobs Near You</h2>
            <p className="text-muted-foreground text-sm">Opportunities in every city and province</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {locations.map((location) => (
              <div key={location.city} className="bg-background rounded-2xl p-5 border border-border hover:shadow-md transition-all cursor-pointer group">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-secondary" />
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-muted text-muted-foreground text-xs font-medium">
                    {location.province}
                  </span>
                </div>
                <h3 className="font-semibold text-lg mb-0.5 group-hover:text-primary transition-colors">{location.city}</h3>
                <p className="text-2xl font-bold text-primary mb-1">{location.jobs}</p>
                <p className="text-xs text-muted-foreground">{location.highlight}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-1">How CareerGate Works</h2>
            <p className="text-muted-foreground text-sm">Get started in 3 simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { step: "1", title: "Search", body: "Find jobs matching your skills, location, and interests. Filter by salary, industry, or job type." },
              { step: "2", title: "Apply", body: "Click through to the employer's page. Each listing includes clear instructions and deadlines." },
              { step: "3", title: "Succeed", body: "Use our career resources to prepare for interviews and negotiate your salary." },
            ].map((s) => (
              <div key={s.step} className="bg-white rounded-2xl p-6 border border-border text-center">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg shadow-sm">
                  {s.step}
                </div>
                <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* This Month Placements */}
      <section className="py-10 bg-white border-y border-border">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm font-semibold text-muted-foreground mb-6">This Month: Jobs Filled Through CareerGate</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recentSuccessStories.map((story) => (
              <div key={story.province} className="bg-background rounded-2xl p-5 border border-border text-center">
                <div className="text-2xl font-bold text-primary mb-0.5">{story.placed}</div>
                <div className="text-sm font-semibold">{story.province}</div>
                <div className="text-xs text-muted-foreground">{story.sector}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Your Future Starts Here</h2>
          <p className="text-xl text-white/90 mb-4 max-w-2xl mx-auto">
            Join over 100,000 South Africans who use CareerGate every month to find opportunities that change their lives.
          </p>
          <p className="text-base text-white/80 mb-8 max-w-xl mx-auto">
            Whether you're a matriculant looking for your first job or an experienced professional ready for a new challenge.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Link to="/jobs">
              <Button size="lg" variant="secondary" className="text-base px-8 h-12">
                Browse All Jobs <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link to="/stem-careers">
              <Button size="lg" variant="outline" className="text-base px-8 h-12 border-white text-white hover:bg-white/10">
                Explore STEM Careers <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-white/80 text-sm">
            {["100% Free", "No Registration Required", "Updated Daily"].map((item) => (
              <div key={item} className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
