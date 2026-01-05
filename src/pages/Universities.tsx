import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  GraduationCap, 
  MapPin, 
  Users, 
  Globe,
  ExternalLink,
  BookOpen,
  Award,
  Building2
} from "lucide-react";
import { Link } from "react-router-dom";

const Universities = () => {
  const publicUniversities = [
    {
      name: "University of Cape Town (UCT)",
      location: "Cape Town, Western Cape",
      type: "Traditional",
      ranking: "#1 in Africa",
      students: "29,000+",
      website: "https://www.uct.ac.za",
      description: "South Africa's oldest university, consistently ranked #1 in Africa. Known for medicine, law, commerce, and humanities.",
      popular: ["Medicine", "Law", "Commerce", "Engineering"],
    },
    {
      name: "University of the Witwatersrand (Wits)",
      location: "Johannesburg, Gauteng",
      type: "Traditional",
      ranking: "#2 in SA",
      students: "40,000+",
      website: "https://www.wits.ac.za",
      description: "Leading research university in Johannesburg. Strong in engineering, health sciences, and business.",
      popular: ["Engineering", "Medicine", "Business", "Law"],
    },
    {
      name: "Stellenbosch University",
      location: "Stellenbosch, Western Cape",
      type: "Traditional",
      ranking: "#3 in SA",
      students: "32,000+",
      website: "https://www.sun.ac.za",
      description: "Historic university known for research excellence, particularly in agriculture, engineering, and sciences.",
      popular: ["Agriculture", "Engineering", "Medicine", "MBA"],
    },
    {
      name: "University of Pretoria (UP)",
      location: "Pretoria, Gauteng",
      type: "Traditional",
      ranking: "#4 in SA",
      students: "55,000+",
      website: "https://www.up.ac.za",
      description: "One of the largest contact universities in SA. Strong veterinary science, engineering, and law programmes.",
      popular: ["Veterinary Science", "Engineering", "Law", "Education"],
    },
    {
      name: "University of Johannesburg (UJ)",
      location: "Johannesburg, Gauteng",
      type: "Comprehensive",
      ranking: "Top 5 in SA",
      students: "50,000+",
      website: "https://www.uj.ac.za",
      description: "Young, dynamic university formed in 2005. Known for accessibility and strong engineering and science programmes.",
      popular: ["Engineering", "IT", "Business", "Education"],
    },
    {
      name: "University of KwaZulu-Natal (UKZN)",
      location: "Durban, KwaZulu-Natal",
      type: "Traditional",
      ranking: "Top 6 in SA",
      students: "47,000+",
      website: "https://www.ukzn.ac.za",
      description: "Merged university with campuses in Durban and Pietermaritzburg. Strong in health sciences and agriculture.",
      popular: ["Medicine", "Agriculture", "Engineering", "Law"],
    },
  ];

  const tvetColleges = [
    { name: "Ekurhuleni East TVET College", province: "Gauteng", campuses: 6 },
    { name: "College of Cape Town", province: "Western Cape", campuses: 8 },
    { name: "Durban University of Technology", province: "KwaZulu-Natal", campuses: 7 },
    { name: "Tshwane South TVET College", province: "Gauteng", campuses: 9 },
    { name: "False Bay TVET College", province: "Western Cape", campuses: 5 },
    { name: "Majuba TVET College", province: "KwaZulu-Natal", campuses: 6 },
  ];

  const applicationDates = [
    { period: "Applications Open", date: "1 April 2026", description: "Most universities open applications for 2027" },
    { period: "Early Applications Close", date: "30 June 2026", description: "Some universities close early for popular courses" },
    { period: "Final Deadline", date: "30 September 2026", description: "Final deadline for most undergraduate applications" },
    { period: "Late Applications", date: "October-November", description: "Limited late applications may be accepted" },
  ];

  const studyFields = [
    { field: "Engineering & Technology", demand: "Very High", salary: "R300K - R800K", icon: Building2 },
    { field: "Health Sciences", demand: "Very High", salary: "R250K - R1.2M", icon: GraduationCap },
    { field: "Information Technology", demand: "Very High", salary: "R280K - R900K", icon: Globe },
    { field: "Commerce & Business", demand: "High", salary: "R200K - R600K", icon: Award },
    { field: "Education", demand: "High", salary: "R180K - R400K", icon: BookOpen },
    { field: "Law", demand: "Medium", salary: "R250K - R1M", icon: Award },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              <GraduationCap className="w-3 h-3 mr-1" />
              Higher Education Guide
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              South African Universities & Colleges
            </h1>
            <p className="text-xl text-white/90">
              Complete guide to universities, TVET colleges, and higher education institutions in South Africa. Find the right institution for your future.
            </p>
          </div>
        </div>
      </section>

      {/* Application Timeline */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">2026 Application Timeline</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {applicationDates.map((item, index) => (
              <Card key={index} className="p-5 text-center">
                <div className="text-primary font-bold text-lg mb-1">{item.date}</div>
                <div className="font-semibold mb-2">{item.period}</div>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Public Universities */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Top Public Universities</h2>
            <Badge variant="secondary">26 Public Universities in SA</Badge>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {publicUniversities.map((uni, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-xl mb-1">{uni.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {uni.location}
                    </div>
                  </div>
                  <Badge variant="outline">{uni.ranking}</Badge>
                </div>
                <p className="text-muted-foreground mb-4">{uni.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {uni.popular.map((course) => (
                    <Badge key={course} variant="secondary" className="text-xs">{course}</Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {uni.students} students
                    </span>
                    <Badge variant="outline" className="text-xs">{uni.type}</Badge>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <a href={uni.website} target="_blank" rel="noopener noreferrer">
                      Visit Website <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Study Fields */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">High-Demand Study Fields</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {studyFields.map((field, index) => (
              <Card key={index} className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <field.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{field.field}</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant={field.demand === "Very High" ? "default" : "secondary"} className="text-xs">
                        {field.demand} Demand
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">Salary: {field.salary}/year</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* TVET Colleges */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">TVET Colleges</h2>
              <p className="text-muted-foreground">Technical and Vocational Education and Training</p>
            </div>
            <Badge variant="secondary">50 TVET Colleges Nationwide</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tvetColleges.map((college, index) => (
              <Card key={index} className="p-5 hover:shadow-md transition-shadow cursor-pointer">
                <h3 className="font-semibold mb-2">{college.name}</h3>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {college.province}
                  </span>
                  <Badge variant="outline">{college.campuses} Campuses</Badge>
                </div>
              </Card>
            ))}
          </div>
          <div className="mt-6 text-center">
            <p className="text-muted-foreground mb-4">TVET colleges offer practical, career-focused qualifications including N1-N6, NCV, and occupational programmes.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Need Funding for Your Studies?
          </h2>
          <p className="text-white/90 mb-6 max-w-xl mx-auto">
            Explore NSFAS, bursaries, and scholarships to fund your higher education journey.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/nsfas">
              <Button size="lg" variant="secondary">
                Apply for NSFAS
              </Button>
            </Link>
            <Link to="/bursaries">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Browse Bursaries
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Universities;
