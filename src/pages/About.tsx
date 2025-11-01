import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Target, Users, TrendingUp, Award } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description: "To simplify job searching by aggregating opportunities from across South Africa into one powerful platform.",
    },
    {
      icon: Users,
      title: "Community First",
      description: "We're dedicated to connecting talented South Africans with companies that value their skills and potential.",
    },
    {
      icon: TrendingUp,
      title: "Growth Focused",
      description: "Helping job seekers advance their careers and employers find the perfect candidates for growth.",
    },
    {
      icon: Award,
      title: "Quality Driven",
      description: "We curate and verify job listings to ensure you only see legitimate, high-quality opportunities.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-hero py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              About JobFinder SA
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              South Africa's premier job aggregator, bringing together opportunities from across the nation into one seamless search experience.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                JobFinder SA was founded with a simple yet powerful vision: to make job searching in South Africa easier, faster, and more efficient. We recognized that job seekers were spending countless hours visiting multiple job boards, company websites, and recruitment agencies.
              </p>
              <p>
                Our platform aggregates thousands of job listings from across South Africa, allowing you to search once and access opportunities from multiple sources. Whether you're looking for your first job, a career change, or your next big opportunity, we're here to help.
              </p>
              <p>
                We work with companies of all sizes – from innovative startups in Cape Town to established corporations in Johannesburg – to bring you the most comprehensive collection of job opportunities in South Africa.
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value) => (
                <Card key={value.title} className="p-6 text-center hover:shadow-lg transition-shadow">
                  <value.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">10,000+</div>
              <div className="text-muted-foreground">Active Job Listings</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Partner Companies</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50,000+</div>
              <div className="text-muted-foreground">Job Seekers</div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
