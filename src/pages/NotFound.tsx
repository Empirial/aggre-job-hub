import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, Search, Briefcase, GraduationCap, Cpu } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const helpfulLinks = [
    { icon: Home, label: "Homepage", path: "/", description: "Start fresh from our homepage" },
    { icon: Briefcase, label: "Browse Jobs", path: "/jobs", description: "Explore government job opportunities" },
    { icon: GraduationCap, label: "Bursaries", path: "/bursaries", description: "Find funding for your education" },
    { icon: Cpu, label: "STEM Careers", path: "/stem-careers", description: "Discover high-demand career paths" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-7xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-3xl font-semibold mb-4">Page Not Found</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            We couldn't find the page you're looking for. It may have been moved, deleted, or the URL might be incorrect. 
            Don't worry — let's help you find what you need.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            {helpfulLinks.map((link) => (
              <Card key={link.path} className="p-4 hover:shadow-lg transition-shadow">
                <Link to={link.path} className="flex items-start gap-4 text-left">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <link.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{link.label}</h3>
                    <p className="text-sm text-muted-foreground">{link.description}</p>
                  </div>
                </Link>
              </Card>
            ))}
          </div>

          <div className="bg-muted/50 rounded-lg p-6">
            <Search className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
            <h3 className="font-semibold mb-2">Looking for something specific?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              CareerGate helps South Africans find government jobs, bursaries, and STEM career information. 
              Use the navigation above or visit our homepage to explore all our resources.
            </p>
            <Button asChild size="lg">
              <Link to="/">Go to Homepage</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
