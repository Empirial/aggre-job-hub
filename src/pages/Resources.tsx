import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  TrendingUp, 
  GraduationCap, 
  FileText, 
  Briefcase,
  ArrowRight,
  Calendar,
  Clock
} from "lucide-react";
import { Link } from "react-router-dom";

const Resources = () => {
  const featuredArticles = [
    {
      slug: "sa-job-market-guide-2026",
      title: "The Ultimate Guide to the South African Job Market in 2026",
      excerpt: "A comprehensive analysis of employment trends, in-demand skills, and salary expectations across all nine provinces. Learn which sectors are hiring and how to position yourself for success.",
      category: "Career Guide",
      readTime: "12 min read",
      date: "January 2026",
      icon: TrendingUp,
      featured: true,
    },
    {
      slug: "nsfas-application-mistakes",
      title: "5 Common Mistakes to Avoid on Your NSFAS Application",
      excerpt: "Don't let simple errors cost you your funding. Learn about the most common pitfalls that cause NSFAS applications to be rejected and how to avoid them.",
      category: "Education",
      readTime: "8 min read",
      date: "January 2026",
      icon: GraduationCap,
      featured: true,
    },
    {
      slug: "johannesburg-cv-tips",
      title: "How to Write a CV That Lands an Interview in Johannesburg",
      excerpt: "Tailored advice for job seekers in Gauteng. Understand what Johannesburg employers are looking for and how to format your CV for maximum impact.",
      category: "Job Search",
      readTime: "10 min read",
      date: "January 2026",
      icon: FileText,
      featured: true,
    },
    {
      slug: "sassa-srd-guide",
      title: "Navigating the SASSA SRD R370 Grant: Eligibility and Appeals Process",
      excerpt: "A clear, step-by-step guide to understanding the SRD grant, checking your eligibility, and appealing if your application was declined.",
      category: "Social Grants",
      readTime: "9 min read",
      date: "January 2026",
      icon: Briefcase,
      featured: false,
    },
    {
      slug: "western-cape-stem-bursaries",
      title: "The Best Bursaries for STEM Students in the Western Cape",
      excerpt: "A curated list of bursary opportunities specifically for students pursuing Science, Technology, Engineering, and Mathematics in the Western Cape.",
      category: "Bursaries",
      readTime: "7 min read",
      date: "January 2026",
      icon: GraduationCap,
      featured: false,
    },
  ];

  const categories = [
    { name: "Career Guides", count: 8, icon: TrendingUp },
    { name: "Education & Bursaries", count: 12, icon: GraduationCap },
    { name: "Job Search Tips", count: 6, icon: FileText },
    { name: "Social Grants", count: 5, icon: Briefcase },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-hero py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              <BookOpen className="w-3 h-3 mr-1" />
              Career Resources
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Expert Career Advice & Guides
            </h1>
            <p className="text-xl text-white/90 mb-6">
              In-depth articles, practical tips, and comprehensive guides to help you navigate the South African job market, secure funding for your education, and build a successful career.
            </p>
            <p className="text-white/80">
              At CareerGate, we believe that access to quality information is the first step toward employment and economic empowerment. Our editorial team researches and writes original content specifically for South African job seekers, students, and grant beneficiaries.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Featured Articles</h2>
              <p className="text-muted-foreground">Our most popular and helpful guides</p>
            </div>
          </div>

          {/* Featured Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {featuredArticles.filter(a => a.featured).map((article) => (
              <Link key={article.slug} to={`/resources/${article.slug}`}>
                <Card className="h-full p-6 hover:shadow-lg transition-all duration-300 group cursor-pointer">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="secondary">{article.category}</Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.readTime}
                    </span>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <article.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-3 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center text-primary text-sm font-medium">
                    Read Article
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {/* Other Articles */}
          <div className="space-y-4">
            {featuredArticles.filter(a => !a.featured).map((article) => (
              <Link key={article.slug} to={`/resources/${article.slug}`}>
                <Card className="p-5 hover:shadow-md transition-all duration-300 group cursor-pointer">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <article.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge variant="outline">{article.category}</Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {article.readTime}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {article.date}
                        </span>
                      </div>
                      <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {article.excerpt}
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all hidden sm:block" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Card key={category.name} className="p-5 text-center hover:shadow-md transition-shadow cursor-pointer group">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                  <category.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-medium mb-1">{category.name}</h3>
                <p className="text-sm text-muted-foreground">{category.count} articles</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <Card className="p-8 md:p-12 bg-gradient-hero text-white text-center">
            <BookOpen className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Stay Informed with CareerGate
            </h2>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Our team publishes new articles weekly, covering the latest job market trends, funding opportunities, and career advice specifically for South Africans.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/jobs">
                <Button size="lg" variant="secondary">
                  Browse Jobs
                </Button>
              </Link>
              <Link to="/bursaries">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Find Bursaries
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Resources;
