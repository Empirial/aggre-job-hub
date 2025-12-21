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
  DollarSign
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const handleSearch = (keywords: string, location: string) => {
    navigate('/jobs', { state: { keywords, location } });
  };

  const categories = [
    { name: "Technology", count: "5,234", icon: Briefcase },
    { name: "Marketing", count: "2,156", icon: TrendingUp },
    { name: "Design", count: "1,892", icon: Building2 },
    { name: "Sales", count: "3,421", icon: Users },
  ];

  const locations = [
    { city: "Johannesburg", jobs: "8,234" },
    { city: "Cape Town", jobs: "6,567" },
    { city: "Durban", jobs: "3,891" },
    { city: "Remote", jobs: "12,432" },
  ];

  const testimonials = [
    {
      name: "Thandi Molefe",
      role: "Software Developer",
      company: "Takealot",
      image: "TM",
      quote: "After 6 months of searching on multiple platforms, I found my dream job through CareerGate within 2 weeks. The STEM career guides helped me understand what skills to highlight.",
      rating: 5,
    },
    {
      name: "Sipho Nkosi",
      role: "Civil Engineering Graduate",
      company: "AECOM",
      image: "SN",
      quote: "The bursary section connected me with the Sasol bursary which funded my entire degree. Now I'm working as a graduate engineer. This platform changed my life!",
      rating: 5,
    },
    {
      name: "Ayanda Dlamini",
      role: "Data Analyst",
      company: "Standard Bank",
      image: "AD",
      quote: "Coming from a rural area, I had no idea what career paths existed. CareerGate opened my eyes to opportunities I never knew about. Highly recommend!",
      rating: 5,
    },
  ];

  const featuredBursaries = [
    {
      name: "NSFAS Bursary",
      provider: "Dept of Higher Education",
      deadline: "Nov 2025",
      covers: ["Tuition", "Accommodation", "Books", "Living Allowance"],
      type: "Government",
    },
    {
      name: "Sasol Bursary",
      provider: "Sasol Limited",
      deadline: "May 2025",
      covers: ["Full Tuition", "Accommodation", "Laptop"],
      type: "Corporate",
    },
    {
      name: "Allan Gray Fellowship",
      provider: "Allan Gray Foundation",
      deadline: "Feb 2025",
      covers: ["Full Funding", "Mentorship", "Startup Capital"],
      type: "Private",
    },
  ];

  const stemSpotlight = [
    {
      title: "Software Developer",
      icon: Code,
      salary: "R250K - R900K",
      demand: "Very High",
      description: "Build applications and systems that power businesses and improve lives.",
    },
    {
      title: "Data Scientist",
      icon: Cpu,
      salary: "R350K - R1.2M",
      demand: "Very High",
      description: "Analyze data to uncover insights that drive business decisions.",
    },
    {
      title: "Biomedical Scientist",
      icon: Microscope,
      salary: "R280K - R650K",
      demand: "High",
      description: "Research diseases and develop treatments to improve healthcare.",
    },
    {
      title: "Actuary",
      icon: Calculator,
      salary: "R500K - R2M+",
      demand: "High",
      description: "Use mathematics to assess risk and shape financial strategies.",
    },
  ];

  const impactStats = [
    { value: "50K+", label: "Jobs Listed" },
    { value: "200+", label: "Bursaries" },
    { value: "100K+", label: "Monthly Users" },
    { value: "9", label: "Provinces" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 md:py-32">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Find Your Dream Job Today
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Discover thousands of opportunities from top companies across South Africa
            </p>
          </div>
          <SearchBar variant="hero" onSearch={handleSearch} />
          <div className="mt-8 text-center">
            <p className="text-white/80">
              Popular searches:{" "}
              <span className="text-white font-medium">Frontend Developer</span>,{" "}
              <span className="text-white font-medium">Product Manager</span>,{" "}
              <span className="text-white font-medium">Data Scientist</span>
            </p>
          </div>
        </div>
      </section>

      {/* Impact Stats Bar */}
      <section className="bg-card border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {impactStats.map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Browse by Category</h2>
            <p className="text-muted-foreground text-lg">
              Explore jobs across different industries
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link to="/jobs" key={category.name}>
                  <Card className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group h-full">
                    <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
                    <p className="text-muted-foreground">{category.count} jobs available</p>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Bursaries Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="w-6 h-6 text-primary" />
                <span className="text-sm font-medium text-primary uppercase tracking-wide">Education Funding</span>
              </div>
              <h2 className="text-3xl font-bold mb-2">Featured Bursaries</h2>
              <p className="text-muted-foreground">
                Don't miss these funding opportunities for your studies
              </p>
            </div>
            <Link to="/bursaries" className="mt-4 md:mt-0">
              <Button variant="outline" className="gap-2">
                View All Bursaries
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
                <h3 className="font-semibold text-lg mb-1">{bursary.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{bursary.provider}</p>
                <div className="flex flex-wrap gap-1">
                  {bursary.covers.slice(0, 3).map((item) => (
                    <Badge key={item} variant="outline" className="text-xs">
                      {item}
                    </Badge>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* STEM Career Spotlight */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Cpu className="w-6 h-6 text-primary" />
                <span className="text-sm font-medium text-primary uppercase tracking-wide">Career Guide</span>
              </div>
              <h2 className="text-3xl font-bold mb-2">STEM Career Spotlight</h2>
              <p className="text-muted-foreground">
                High-demand careers with excellent earning potential
              </p>
            </div>
            <Link to="/stem-careers" className="mt-4 md:mt-0">
              <Button variant="outline" className="gap-2">
                Explore All Careers
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stemSpotlight.map((career) => (
              <Link to="/stem-careers" key={career.title}>
                <Card className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group h-full">
                  <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <career.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{career.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{career.description}</p>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-1 text-sm">
                      <DollarSign className="w-4 h-4 text-primary" />
                      <span className="font-medium">{career.salary}</span>
                    </div>
                    <Badge variant={career.demand === "Very High" ? "default" : "secondary"} className="text-xs">
                      {career.demand}
                    </Badge>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Real stories from South Africans who found opportunities through our platform
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="p-6 relative">
                <Quote className="w-10 h-10 text-primary/20 absolute top-4 right-4" />
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 relative z-10">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-hero rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.image}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Popular Locations</h2>
            <p className="text-muted-foreground text-lg">
              Find jobs in cities you love
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {locations.map((location) => (
              <Card
                key={location.city}
                className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group"
              >
                <MapPin className="w-8 h-8 text-secondary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-lg mb-2">{location.city}</h3>
                <p className="text-muted-foreground">{location.jobs} jobs</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of job seekers who find their perfect role every day
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/jobs">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Browse All Jobs
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/bursaries">
              <Button size="lg" variant="outline" className="text-lg px-8 border-white text-white hover:bg-white/10">
                Find Bursaries
                <GraduationCap className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
