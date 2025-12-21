import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  GraduationCap, 
  Building2, 
  Landmark, 
  Globe, 
  Microscope,
  CheckCircle,
  FileText,
  Calendar,
  ExternalLink,
  Lightbulb,
  AlertCircle,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useState } from "react";

const Bursaries = () => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const bursaryCategories = [
    {
      icon: Landmark,
      title: "Government Bursaries",
      description: "Funding from national and provincial government departments",
      count: "25+ bursaries",
    },
    {
      icon: Building2,
      title: "Corporate Bursaries",
      description: "Private sector companies investing in education",
      count: "50+ bursaries",
    },
    {
      icon: GraduationCap,
      title: "University Bursaries",
      description: "Institution-specific funding and scholarships",
      count: "100+ bursaries",
    },
    {
      icon: Globe,
      title: "International Scholarships",
      description: "Study abroad and international exchange opportunities",
      count: "30+ scholarships",
    },
    {
      icon: Microscope,
      title: "STEM Bursaries",
      description: "Specialized funding for science, tech, engineering & maths",
      count: "40+ bursaries",
    },
  ];

  const featuredBursaries = [
    {
      name: "National Student Financial Aid Scheme (NSFAS)",
      provider: "Department of Higher Education",
      type: "Government",
      eligibility: "South African citizens with combined household income under R350,000",
      covers: ["Full tuition fees", "Accommodation allowance", "Book allowance", "Living allowance", "Transport allowance"],
      deadline: "Applications typically open September-November",
      fields: "All fields of study at public universities and TVET colleges",
      link: "https://www.nsfas.org.za",
      tips: "Apply early as funding is limited. Ensure SASSA details are linked if applicable.",
    },
    {
      name: "Funza Lushaka Bursary Programme",
      provider: "Department of Basic Education",
      type: "Government",
      eligibility: "Matriculants or current students pursuing a teaching qualification",
      covers: ["Full tuition fees", "Accommodation", "Books and learning materials", "Monthly living allowance"],
      deadline: "January to April annually",
      fields: "Bachelor of Education or PGCE in priority subjects",
      link: "https://www.funzalushaka.doe.gov.za",
      tips: "Priority given to maths, science, and African language specializations.",
    },
    {
      name: "Sasol Bursary Programme",
      provider: "Sasol Limited",
      type: "Corporate",
      eligibility: "South African citizens, minimum 60% in Grade 12 maths and science",
      covers: ["Full tuition fees", "Accommodation", "Book allowance", "Laptop", "Vacation work opportunities"],
      deadline: "March to May annually",
      fields: "Chemical Engineering, Mechanical Engineering, Electrical Engineering, Mining Engineering",
      link: "https://www.sasol.com/careers/bursaries",
      tips: "Strong academic record and leadership potential are key selection criteria.",
    },
    {
      name: "Anglo American Bursary",
      provider: "Anglo American South Africa",
      type: "Corporate",
      eligibility: "Grade 12 learners or current university students with strong academics",
      covers: ["Full tuition", "Accommodation", "Monthly allowance", "Mentorship programme", "Holiday employment"],
      deadline: "February to April",
      fields: "Mining Engineering, Metallurgy, Geology, Environmental Science, Mechanical Engineering",
      link: "https://www.angloamerican.com",
      tips: "Candidates from mining communities given preference. Apply through university bursary offices.",
    },
    {
      name: "Eskom Bursary Scheme",
      provider: "Eskom Holdings",
      type: "Corporate",
      eligibility: "South African citizens with strong maths and physical science results",
      covers: ["Tuition fees", "Accommodation", "Books", "Monthly stipend", "Practical training"],
      deadline: "July to September",
      fields: "Electrical Engineering, Mechanical Engineering, Civil Engineering, Finance, IT",
      link: "https://www.eskom.co.za/careers",
      tips: "Eskom prioritizes candidates from disadvantaged backgrounds. Good interpersonal skills valued.",
    },
    {
      name: "Allan Gray Orbis Foundation Fellowship",
      provider: "Allan Gray Orbis Foundation",
      type: "Private",
      eligibility: "Exceptional Grade 12 learners who demonstrate entrepreneurial potential",
      covers: ["Full tuition", "Accommodation", "Living expenses", "Entrepreneurship training", "Mentorship", "Startup funding opportunity"],
      deadline: "February annually",
      fields: "Any field at partner universities (UCT, Wits, Rhodes, Stellenbosch)",
      link: "https://www.allangrayorbis.org",
      tips: "This is highly competitive - focus on demonstrating entrepreneurial mindset and leadership.",
    },
    {
      name: "Standard Bank Derek Cooper Scholarship",
      provider: "Standard Bank",
      type: "Corporate",
      eligibility: "Academically excellent students with leadership potential",
      covers: ["Full tuition", "Accommodation", "Living allowance", "Laptop", "Internship opportunities"],
      deadline: "March to June",
      fields: "Commerce, Finance, IT, Data Science, Actuarial Science",
      link: "https://www.standardbank.com",
      tips: "Strong emphasis on extracurricular leadership activities.",
    },
    {
      name: "Mastercard Foundation Scholars Program",
      provider: "Mastercard Foundation",
      type: "International",
      eligibility: "Academically talented young Africans from economically disadvantaged backgrounds",
      covers: ["Full tuition", "Accommodation", "Stipend", "Travel costs", "Mentorship", "Career support"],
      deadline: "Varies by university",
      fields: "Various fields at partner universities (UCT, University of Pretoria)",
      link: "https://mastercardfdn.org/scholars",
      tips: "Strong commitment to giving back to community is essential.",
    },
  ];

  const applicationTips = [
    {
      icon: Calendar,
      title: "Start Early",
      description: "Begin your bursary search 6-12 months before you need funding. Most applications close 3-6 months before the academic year.",
    },
    {
      icon: FileText,
      title: "Prepare Documents",
      description: "Have certified copies of: ID, matric certificate, academic transcripts, proof of income, and motivational letter ready.",
    },
    {
      icon: CheckCircle,
      title: "Apply to Multiple",
      description: "Don't put all eggs in one basket. Apply to at least 5-10 bursaries that match your profile and field of study.",
    },
    {
      icon: Lightbulb,
      title: "Write a Strong Motivation",
      description: "Be specific about your career goals, challenges you've overcome, and why you deserve the bursary. Personalize each application.",
    },
    {
      icon: AlertCircle,
      title: "Check Eligibility Carefully",
      description: "Read all requirements before applying. Some bursaries have specific criteria like household income limits or field of study restrictions.",
    },
  ];

  const requiredDocuments = [
    "Certified copy of South African ID",
    "Certified copy of matric certificate or latest academic results",
    "Proof of household income (parent/guardian payslips or UIF documentation)",
    "Proof of residence (utility bill or affidavit)",
    "Motivational letter (1-2 pages)",
    "CV/Resume with contact details",
    "Academic transcripts from current/previous institution",
    "Two reference letters (teacher/principal/community leader)",
    "Passport-sized photos (some applications require)",
    "Proof of registration or acceptance letter",
  ];

  const faqs = [
    {
      question: "Can I apply for multiple bursaries at once?",
      answer: "Yes, you can and should apply for multiple bursaries. However, if you're awarded multiple bursaries, you'll need to choose one as most bursaries don't allow recipients to hold concurrent awards. Be honest during the application process about other applications.",
    },
    {
      question: "What happens if I fail a module while on a bursary?",
      answer: "Most bursaries require you to maintain a certain academic standard. If you fail, you may be given a probation period to improve. Repeated failures can result in bursary termination and you may need to repay funds. Always communicate with your bursary provider if you're struggling academically.",
    },
    {
      question: "Do I have to work for the company after completing my studies?",
      answer: "Corporate bursaries often include a work-back agreement, typically 1 year of work for each year of funding received. Government bursaries like Funza Lushaka also require you to work in public schools. Make sure you understand these obligations before accepting.",
    },
    {
      question: "Can I change my field of study while on a bursary?",
      answer: "This depends on the bursary terms. Some allow changes within related fields, while others are strictly tied to specific courses. Always get written approval from your bursary provider before making any changes to avoid losing your funding.",
    },
    {
      question: "What if I can't find a bursary for my field of study?",
      answer: "Consider NSFAS which covers all fields at public institutions. Also look at university-specific funding, bank study loans, and crowdfunding. Some employers offer part-time work that can help cover study costs.",
    },
    {
      question: "How do I know if a bursary is legitimate?",
      answer: "Legitimate bursaries never ask for application fees. Verify the company/organization exists and check their official website. Be wary of bursaries promising guaranteed acceptance or asking for payment. When in doubt, contact the organization directly.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-hero py-20">
          <div className="container mx-auto px-4 text-center">
            <GraduationCap className="w-16 h-16 mx-auto mb-6 text-white" />
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              South African Bursaries & Scholarships
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
              Access comprehensive information on over 200 bursaries, scholarships, and funding opportunities. Education is your right — let us help you find the funding to achieve your dreams.
            </p>
          </div>
        </section>

        {/* Categories Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Browse by Category</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore bursaries across different funding sources and fields of study.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {bursaryCategories.map((category) => (
              <Card key={category.title} className="p-6 text-center hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <category.icon className="w-12 h-12 mx-auto mb-4 text-primary group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-lg mb-2">{category.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{category.description}</p>
                <Badge variant="secondary">{category.count}</Badge>
              </Card>
            ))}
          </div>
        </section>

        {/* Featured Bursaries */}
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Featured Bursaries</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Detailed information on top bursaries to help you make informed decisions.
              </p>
            </div>
            <div className="space-y-6 max-w-5xl mx-auto">
              {featuredBursaries.map((bursary) => (
                <Card key={bursary.name} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{bursary.name}</h3>
                      <p className="text-muted-foreground">{bursary.provider}</p>
                    </div>
                    <Badge variant={bursary.type === "Government" ? "default" : bursary.type === "Corporate" ? "secondary" : "outline"}>
                      {bursary.type}
                    </Badge>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        Eligibility
                      </h4>
                      <p className="text-sm text-muted-foreground">{bursary.eligibility}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        Application Period
                      </h4>
                      <p className="text-sm text-muted-foreground">{bursary.deadline}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">What's Covered</h4>
                    <div className="flex flex-wrap gap-2">
                      {bursary.covers.map((item) => (
                        <Badge key={item} variant="outline" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Fields of Study</h4>
                    <p className="text-sm text-muted-foreground">{bursary.fields}</p>
                  </div>

                  <div className="bg-primary/5 p-4 rounded-lg mb-4">
                    <h4 className="font-medium mb-1 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-primary" />
                      Pro Tip
                    </h4>
                    <p className="text-sm text-muted-foreground">{bursary.tips}</p>
                  </div>

                  <Button variant="outline" className="w-full sm:w-auto" asChild>
                    <a href={bursary.link} target="_blank" rel="noopener noreferrer">
                      Visit Official Website
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Application Tips */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Application Tips</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Maximize your chances of success with these proven strategies.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {applicationTips.map((tip, index) => (
              <Card key={tip.title} className="p-6 relative">
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-hero rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                <tip.icon className="w-10 h-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">{tip.title}</h3>
                <p className="text-sm text-muted-foreground">{tip.description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Required Documents */}
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <FileText className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h2 className="text-3xl font-bold mb-4">Required Documents Checklist</h2>
                <p className="text-muted-foreground">
                  Prepare these documents before you start your applications.
                </p>
              </div>
              <Card className="p-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {requiredDocuments.map((doc, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{doc}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">
                Common questions about bursaries and scholarships in South Africa.
              </p>
            </div>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <Card 
                  key={index} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                >
                  <div className="p-4 flex items-center justify-between gap-4">
                    <h3 className="font-medium">{faq.question}</h3>
                    {expandedFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    )}
                  </div>
                  {expandedFaq === index && (
                    <div className="px-4 pb-4">
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-hero py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-white/90 max-w-2xl mx-auto mb-8">
              Reach out to us and we'll help you find bursaries that match your profile and aspirations.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <a href="/contact">Contact Us for Help</a>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Bursaries;
