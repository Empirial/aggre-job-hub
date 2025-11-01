import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/SearchBar";
import { Card } from "@/components/ui/card";
import { Briefcase, Building2, TrendingUp, Users, MapPin, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const handleSearch = (keywords: string, location: string) => {
    // Navigate to jobs page - the Jobs page will handle the search
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 md:py-32">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Find Your Dream Job Today
            </h2>
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

      <Footer />
    </div>
  );
};

export default Index;
