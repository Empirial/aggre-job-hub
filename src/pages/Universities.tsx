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
import { Calendar, AlertCircle } from "lucide-react";

const Universities = () => {
  // Late Registration 2026 - Updated for current period
  const lateRegistrationOpen = [
    {
      name: "University of Cape Town (UCT)",
      lateRegOpen: "6 January 2026",
      lateRegClose: "31 January 2026",
      status: "Open",
      website: "https://www.uct.ac.za",
      notes: "Limited courses available for late registration",
    },
    {
      name: "University of the Witwatersrand (Wits)",
      lateRegOpen: "8 January 2026",
      lateRegClose: "7 February 2026",
      status: "Open",
      website: "https://www.wits.ac.za",
      notes: "Online applications only",
    },
    {
      name: "University of Johannesburg (UJ)",
      lateRegOpen: "6 January 2026",
      lateRegClose: "14 February 2026",
      status: "Open",
      website: "https://www.uj.ac.za",
      notes: "Walk-in and online applications accepted",
    },
    {
      name: "University of Pretoria (UP)",
      lateRegOpen: "13 January 2026",
      lateRegClose: "31 January 2026",
      status: "Open",
      website: "https://www.up.ac.za",
      notes: "Subject to availability",
    },
    {
      name: "Stellenbosch University",
      lateRegOpen: "7 January 2026",
      lateRegClose: "28 January 2026",
      status: "Open",
      website: "https://www.sun.ac.za",
      notes: "Limited programmes accepting late applications",
    },
    {
      name: "University of KwaZulu-Natal (UKZN)",
      lateRegOpen: "6 January 2026",
      lateRegClose: "21 February 2026",
      status: "Open",
      website: "https://www.ukzn.ac.za",
      notes: "All campuses accepting applications",
    },
    {
      name: "University of the Free State (UFS)",
      lateRegOpen: "10 January 2026",
      lateRegClose: "15 February 2026",
      status: "Open",
      website: "https://www.ufs.ac.za",
      notes: "Bloemfontein and Qwaqwa campuses",
    },
    {
      name: "Nelson Mandela University (NMU)",
      lateRegOpen: "8 January 2026",
      lateRegClose: "28 February 2026",
      status: "Open",
      website: "https://www.mandela.ac.za",
      notes: "Extended deadline for selected programmes",
    },
    {
      name: "Tshwane University of Technology (TUT)",
      lateRegOpen: "6 January 2026",
      lateRegClose: "31 January 2026",
      status: "Open",
      website: "https://www.tut.ac.za",
      notes: "All campuses - first come first served",
    },
    {
      name: "Cape Peninsula University of Technology (CPUT)",
      lateRegOpen: "7 January 2026",
      lateRegClose: "14 February 2026",
      status: "Open",
      website: "https://www.cput.ac.za",
      notes: "Limited spaces in engineering programmes",
    },
  ];

  const tvetLateRegistration = [
    {
      name: "Ekurhuleni East TVET College",
      province: "Gauteng",
      lateRegClose: "28 February 2026",
      status: "Open",
      programmes: ["N1-N6 Engineering", "NCV", "Occupational Programmes"],
    },
    {
      name: "College of Cape Town",
      province: "Western Cape",
      lateRegClose: "21 February 2026",
      status: "Open",
      programmes: ["Business Studies", "Engineering", "Hospitality"],
    },
    {
      name: "Tshwane South TVET College",
      province: "Gauteng",
      lateRegClose: "28 February 2026",
      status: "Open",
      programmes: ["N1-N6", "NCV Level 2-4", "Learnerships"],
    },
    {
      name: "Majuba TVET College",
      province: "KwaZulu-Natal",
      lateRegClose: "14 February 2026",
      status: "Open",
      programmes: ["Engineering", "Business", "IT"],
    },
    {
      name: "False Bay TVET College",
      province: "Western Cape",
      lateRegClose: "21 February 2026",
      status: "Open",
      programmes: ["NCV", "Engineering", "Business Studies"],
    },
    {
      name: "Central Johannesburg TVET College",
      province: "Gauteng",
      lateRegClose: "28 February 2026",
      status: "Open",
      programmes: ["Business", "IT", "Engineering"],
    },
  ];

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

      {/* URGENT: Late Registration Now Open */}
      <section className="py-8 bg-yellow-50 border-y border-yellow-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-6">
            <AlertCircle className="w-6 h-6 text-red-600 animate-pulse" />
            <h2 className="text-2xl font-bold text-red-700">🚨 Late Registration Now Open - January 2026</h2>
          </div>
          <p className="text-muted-foreground mb-6">
            Several South African universities and TVET colleges are accepting late applications for the 2026 academic year. Apply now before spaces fill up!
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {lateRegistrationOpen.map((uni, index) => (
              <Card key={index} className="p-5 border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg">{uni.name}</h3>
                  <Badge className="bg-green-100 text-green-700 border-green-300">{uni.status}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-green-600" />
                    <span><strong>Opens:</strong> {uni.lateRegOpen}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-red-600" />
                    <span><strong>Closes:</strong> {uni.lateRegClose}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{uni.notes}</p>
                <Button size="sm" variant="outline" asChild>
                  <a href={uni.website} target="_blank" rel="noopener noreferrer">
                    Apply Now <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* TVET Late Registration */}
      <section className="py-8 bg-blue-50 border-b border-blue-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-6">
            <GraduationCap className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-blue-800">TVET Colleges - Late Registration 2026</h2>
          </div>
          <p className="text-muted-foreground mb-6">
            TVET colleges offer practical, career-focused qualifications. Many are still accepting late registrations for January 2026 intake.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tvetLateRegistration.map((college, index) => (
              <Card key={index} className="p-5 border-l-4 border-l-blue-500">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold">{college.name}</h3>
                  <Badge className="bg-green-100 text-green-700 border-green-300">{college.status}</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm mb-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{college.province}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-red-600 font-medium mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>Closes: {college.lateRegClose}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {college.programmes.map((prog) => (
                    <Badge key={prog} variant="secondary" className="text-xs">{prog}</Badge>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Application Timeline for 2027 */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-2">2027 Application Timeline</h2>
          <p className="text-muted-foreground mb-6">Planning ahead? Here are the key dates for 2027 applications.</p>
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
