import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Building2, Clock, DollarSign, Bookmark, Share2, Calendar, Users, Briefcase } from "lucide-react";
import { useParams, Link } from "react-router-dom";

const JobDetail = () => {
  const { id } = useParams();

  // Mock job data
  const job = {
    id,
    title: "Senior Frontend Developer",
    company: "Digital Solutions SA",
    location: "Sandton, Johannesburg",
    type: "Full-time",
    salary: "R720k - R1.08M",
    postedDate: "2 days ago",
    tags: ["React", "TypeScript", "CSS", "JavaScript", "Git"],
    description: `We're looking for an experienced frontend developer to join our growing team. You'll work on cutting-edge web applications using React, TypeScript, and modern tooling.`,
    responsibilities: [
      "Build reusable components and front-end libraries for future use",
      "Translate designs and wireframes into high-quality code",
      "Optimize components for maximum performance across devices and browsers",
      "Collaborate with backend developers and designers to improve usability",
      "Write clean, maintainable, and well-documented code",
    ],
    requirements: [
      "5+ years of experience with React and modern JavaScript",
      "Strong proficiency in TypeScript",
      "Experience with state management libraries (Redux, MobX, or similar)",
      "Knowledge of modern CSS methodologies and preprocessors",
      "Understanding of RESTful APIs and asynchronous request handling",
      "Excellent problem-solving and communication skills",
    ],
    benefits: [
      "Competitive salary and equity package",
      "Medical aid and gap cover",
      "Retirement annuity matching",
      "Flexible leave policy",
      "Remote work options",
      "Professional development budget",
      "Wellness and gym benefits",
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              JobFinder
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/jobs" className="text-foreground hover:text-primary transition-colors font-medium">
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

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <Card className="p-8">
              <div className="flex gap-6 mb-6">
                <div className="w-20 h-20 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-10 h-10 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
                  <p className="text-xl text-muted-foreground mb-4">{job.company}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-muted-foreground" />
                      <span>{job.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span>{job.salary}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>Posted {job.postedDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {job.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-3">
                <Button size="lg" className="flex-1">
                  Apply Now
                </Button>
                <Button size="lg" variant="outline">
                  <Bookmark className="w-5 h-5" />
                </Button>
                <Button size="lg" variant="outline">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </Card>

            {/* Job Description */}
            <Card className="p-8">
              <h2 className="text-2xl font-semibold mb-4">About the Role</h2>
              <p className="text-foreground/80 mb-6">{job.description}</p>

              <Separator className="my-6" />

              <h3 className="text-xl font-semibold mb-4">Key Responsibilities</h3>
              <ul className="space-y-2 mb-6">
                {job.responsibilities.map((item, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-foreground/80">{item}</span>
                  </li>
                ))}
              </ul>

              <Separator className="my-6" />

              <h3 className="text-xl font-semibold mb-4">Requirements</h3>
              <ul className="space-y-2 mb-6">
                {job.requirements.map((item, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-foreground/80">{item}</span>
                  </li>
                ))}
              </ul>

              <Separator className="my-6" />

              <h3 className="text-xl font-semibold mb-4">Benefits</h3>
              <ul className="space-y-2">
                {job.benefits.map((item, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="text-success mt-1">✓</span>
                    <span className="text-foreground/80">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Card */}
            <Card className="p-6 sticky top-24">
              <h3 className="text-lg font-semibold mb-4">Apply for this position</h3>
              <Button className="w-full mb-4" size="lg">
                Apply Now
              </Button>
              <Button variant="outline" className="w-full mb-4" size="lg">
                <Bookmark className="w-5 h-5 mr-2" />
                Save Job
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                By applying, you agree to our Terms of Service
              </p>
            </Card>

            {/* Company Info */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">About {job.company}</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Company Size</p>
                    <p className="text-sm text-muted-foreground">200-500 employees</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Founded</p>
                    <p className="text-sm text-muted-foreground">2015</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Headquarters</p>
                    <p className="text-sm text-muted-foreground">Sandton, Johannesburg</p>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                View Company Profile
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
