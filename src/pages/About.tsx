import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Target, Users, TrendingUp, Award, Heart, Globe, BookOpen, Lightbulb, Shield, Clock } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description: "To democratize access to career opportunities and educational funding for all South Africans, regardless of background.",
    },
    {
      icon: Users,
      title: "Community First",
      description: "Building a supportive ecosystem where job seekers, students, and industry professionals connect and grow together.",
    },
    {
      icon: TrendingUp,
      title: "Growth Focused",
      description: "Empowering individuals with the resources, knowledge, and opportunities to advance their careers and achieve their dreams.",
    },
    {
      icon: Award,
      title: "Quality Driven",
      description: "Curating only verified, legitimate opportunities to protect job seekers from scams and ensure meaningful connections.",
    },
    {
      icon: Heart,
      title: "Social Impact",
      description: "Committed to reducing youth unemployment and closing the skills gap through accessible education and career resources.",
    },
    {
      icon: Globe,
      title: "Inclusive Access",
      description: "Breaking down barriers by providing free access to job listings, bursary information, and career guidance for everyone.",
    },
  ];

  const team = [
    {
      name: "Thabo Mokoena",
      role: "Founder & CEO",
      bio: "Former HR director with 15 years of experience in talent acquisition. Passionate about youth empowerment.",
    },
    {
      name: "Naledi Khumalo",
      role: "Head of Partnerships",
      bio: "Built relationships with 200+ companies and educational institutions across South Africa.",
    },
    {
      name: "Sipho Ndlovu",
      role: "Technology Lead",
      bio: "Software engineer dedicated to building accessible technology for underserved communities.",
    },
    {
      name: "Ayanda Zulu",
      role: "Content Director",
      bio: "Career counselor and educator with expertise in STEM education and bursary applications.",
    },
  ];

  const milestones = [
    { year: "2019", event: "JobFinder SA founded in Johannesburg with a vision to simplify job searching" },
    { year: "2020", event: "Launched bursary aggregation service, helping 5,000+ students find funding" },
    { year: "2021", event: "Partnered with DPSA to provide government job listings" },
    { year: "2022", event: "Reached 100,000 monthly active users across South Africa" },
    { year: "2023", event: "Introduced STEM career resources and salary transparency initiative" },
    { year: "2024", event: "Expanded to all 9 provinces with local job matching" },
  ];

  const partners = [
    "Department of Employment and Labour",
    "National Student Financial Aid Scheme (NSFAS)",
    "Universities South Africa (USAf)",
    "Business Unity South Africa (BUSA)",
    "Youth Employment Service (YES)",
    "Harambee Youth Employment Accelerator",
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
            <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
              Empowering South African youth since 2019. We're more than a job board — we're a movement dedicated to unlocking opportunities and building futures for millions of South Africans.
            </p>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold">Our Story</h2>
            </div>
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p className="text-lg">
                JobFinder SA was born from a simple frustration: finding a job in South Africa shouldn't require visiting dozens of websites, and accessing bursary information shouldn't be a privilege reserved for those with connections.
              </p>
              <p>
                In 2019, our founder Thabo Mokoena — after spending 15 years in corporate HR watching talented candidates slip through the cracks — decided enough was enough. He assembled a team of passionate individuals who shared his vision: to create a single platform where every South African, regardless of their postal code or background, could access the same opportunities.
              </p>
              <p>
                We started in a small office in Braamfontein with just three people and a lot of coffee. Today, we're a team of 25 dedicated individuals serving over 100,000 users monthly across all nine provinces. But our mission remains the same: to level the playing field and ensure that talent, not privilege, determines success.
              </p>
              <p>
                What sets us apart is our commitment to the communities we serve. We don't just list jobs — we provide career guidance, bursary information, and STEM resources because we understand that finding a job is just one part of the journey. True empowerment comes from education, skills development, and access to information.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              <Card className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-8 h-8 text-primary" />
                  <h3 className="text-2xl font-bold">Our Mission</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  To democratize access to employment opportunities and educational funding across South Africa. We believe every person deserves equal access to resources that can transform their lives, regardless of their socioeconomic background, geographic location, or connections.
                </p>
              </Card>
              <Card className="p-8 bg-gradient-to-br from-secondary/5 to-primary/5">
                <div className="flex items-center gap-3 mb-4">
                  <Lightbulb className="w-8 h-8 text-secondary" />
                  <h3 className="text-2xl font-bold">Our Vision</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  A South Africa where youth unemployment is a thing of the past. Where every matriculant knows about available bursaries, every job seeker has access to legitimate opportunities, and every aspiring professional can chart their career path with confidence.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do, from the features we build to the partnerships we form.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {values.map((value) => (
              <Card key={value.title} className="p-6 hover:shadow-lg transition-shadow">
                <value.icon className="w-12 h-12 mb-4 text-primary" />
                <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Passionate individuals working tirelessly to connect South Africans with opportunities.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {team.map((member) => (
                <Card key={member.name} className="p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="w-20 h-20 bg-gradient-hero rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg">{member.name}</h3>
                  <p className="text-sm text-primary mb-2">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Journey</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From a small startup to South Africa's leading job and bursary platform.
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            {milestones.map((milestone, index) => (
              <div key={milestone.year} className="flex gap-4 mb-8 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-gradient-hero rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {milestone.year}
                  </div>
                  {index < milestones.length - 1 && (
                    <div className="w-0.5 h-full bg-border mt-2" />
                  )}
                </div>
                <Card className="flex-1 p-4">
                  <p className="text-muted-foreground">{milestone.event}</p>
                </Card>
              </div>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-gradient-hero py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Our Impact</h2>
              <p className="text-white/80 max-w-2xl mx-auto">
                Real numbers that represent real lives changed.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">50K+</div>
                <div className="text-white/80">Jobs Listed Monthly</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">200+</div>
                <div className="text-white/80">Bursaries Tracked</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">100K+</div>
                <div className="text-white/80">Monthly Users</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">9</div>
                <div className="text-white/80">Provinces Covered</div>
              </div>
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Partners</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We collaborate with leading organizations to maximize our impact.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {partners.map((partner) => (
              <Card key={partner} className="p-4 text-center hover:shadow-md transition-shadow">
                <p className="font-medium text-muted-foreground">{partner}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Trust & Safety */}
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-8 h-8 text-primary" />
                <h2 className="text-3xl font-bold">Trust & Safety</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Verified Listings</h3>
                  <p className="text-muted-foreground mb-6">
                    Every job listing and bursary opportunity goes through our verification process. We actively remove scam listings and work with authorities to protect job seekers from fraud.
                  </p>
                  <h3 className="font-semibold text-lg mb-3">Data Protection</h3>
                  <p className="text-muted-foreground">
                    Your personal information is protected under POPIA regulations. We never sell your data and only share what's necessary for job applications you choose to make.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-3">Community Reporting</h3>
                  <p className="text-muted-foreground mb-6">
                    Our community helps us maintain quality by reporting suspicious listings. Together, we've removed over 5,000 fraudulent job posts since 2019.
                  </p>
                  <h3 className="font-semibold text-lg mb-3">Transparent Operations</h3>
                  <p className="text-muted-foreground">
                    We're funded through partnerships and donations — never by selling job seeker data. Our bursary and job information is always free to access.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Mission</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Whether you're looking for a job, applying for bursaries, or want to support our cause, there's a place for you in our community.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/jobs" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6">
              Find Jobs
            </a>
            <a href="/bursaries" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-6">
              Explore Bursaries
            </a>
            <a href="/donate" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/90 h-10 px-6">
              Support Us
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
