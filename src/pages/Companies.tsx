import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Building2 } from "lucide-react";
import { Link } from "react-router-dom";

const Companies = () => {
  const companies = [
    {
      id: 1,
      name: "TechCorp SA",
      logo: null,
      industry: "Technology",
      location: "Johannesburg",
      openPositions: 12,
      description: "Leading technology solutions provider in South Africa, specializing in cloud computing and AI.",
    },
    {
      id: 2,
      name: "FinServe Solutions",
      logo: null,
      industry: "Finance",
      location: "Cape Town",
      openPositions: 8,
      description: "Innovative financial services company transforming digital banking across Africa.",
    },
    {
      id: 3,
      name: "Green Energy Co",
      logo: null,
      industry: "Energy",
      location: "Durban",
      openPositions: 5,
      description: "Renewable energy pioneer committed to sustainable power solutions for South Africa.",
    },
    {
      id: 4,
      name: "HealthFirst Medical",
      logo: null,
      industry: "Healthcare",
      location: "Pretoria",
      openPositions: 15,
      description: "Private healthcare provider offering world-class medical services and facilities.",
    },
    {
      id: 5,
      name: "EduTech Innovations",
      logo: null,
      industry: "Education",
      location: "Johannesburg",
      openPositions: 7,
      description: "EdTech startup revolutionizing online learning with interactive platforms.",
    },
    {
      id: 6,
      name: "RetailHub SA",
      logo: null,
      industry: "Retail",
      location: "Cape Town",
      openPositions: 20,
      description: "Major retail chain with stores across South Africa, known for customer excellence.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-hero py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 text-center">
              Explore Companies
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto text-center mb-8">
              Discover top employers hiring in South Africa
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto bg-card p-4 rounded-2xl shadow-xl">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    placeholder="Search companies..."
                    className="pl-10 h-12 border-none"
                  />
                </div>
                <Button size="lg" className="h-12">
                  Search
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Companies Grid */}
        <section className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">Featured Companies</h2>
              <p className="text-muted-foreground">Showing {companies.length} companies</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <Card key={company.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-lg bg-gradient-card flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-1 truncate">{company.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>{company.location}</span>
                    </div>
                    <Badge variant="secondary">{company.industry}</Badge>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {company.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-sm font-medium text-primary">
                    {company.openPositions} open positions
                  </span>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/jobs">View Jobs</Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Companies;
