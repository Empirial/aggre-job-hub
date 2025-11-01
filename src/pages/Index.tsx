import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/SearchBar";
import { Card } from "@/components/ui/card";
import { Briefcase, Building2, TrendingUp, Users, MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const categories = [
    { name: "Technology", count: "5,234", icon: Briefcase },
    { name: "Marketing", count: "2,156", icon: TrendingUp },
    { name: "Design", count: "1,892", icon: Building2 },
    { name: "Sales", count: "3,421", icon: Users },
  ];

  const locations = [
    { city: "San Francisco", jobs: "12,234" },
    { city: "New York", jobs: "10,567" },
    { city: "Austin", jobs: "8,901" },
    { city: "Remote", jobs: "25,432" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              JobFinder
            </h1>
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/jobs" className="text-muted-foreground hover:text-foreground transition-colors">
                Find Jobs
              </Link>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Companies
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Resources
              </a>
              <Button variant="outline">Sign In</Button>
              <Button>Post a Job</Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 md:py-32">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Find Your Dream Job Today
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Discover thousands of opportunities from top companies around the world
            </p>
          </div>
          <SearchBar variant="hero" />
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

      {/* Categories Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Browse by Category</h3>
            <p className="text-muted-foreground text-lg">
              Explore jobs across different industries
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Card
                  key={category.name}
                  className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                >
                  <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-lg mb-2">{category.name}</h4>
                  <p className="text-muted-foreground">{category.count} jobs available</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Popular Locations</h3>
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
                <h4 className="font-semibold text-lg mb-2">{location.city}</h4>
                <p className="text-muted-foreground">{location.jobs} jobs</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h3>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of job seekers who find their perfect role every day
          </p>
          <Link to="/jobs">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Browse All Jobs
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold text-lg mb-4 bg-gradient-hero bg-clip-text text-transparent">
                JobFinder
              </h4>
              <p className="text-muted-foreground">
                Your trusted platform for finding the perfect job opportunity.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">For Job Seekers</h5>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Browse Jobs</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Companies</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Career Advice</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">For Employers</h5>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Post a Job</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Resources</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Company</h5>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>© 2024 JobFinder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
