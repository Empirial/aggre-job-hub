import { JobCard } from "@/components/JobCard";
import { SearchBar } from "@/components/SearchBar";
import { FilterSidebar } from "@/components/FilterSidebar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SlidersHorizontal } from "lucide-react";

// Mock data
const mockJobs = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$120k - $180k",
    postedDate: "2 days ago",
    description: "We're looking for an experienced frontend developer to join our growing team. You'll work on cutting-edge web applications using React, TypeScript, and modern tooling.",
    tags: ["React", "TypeScript", "CSS"],
  },
  {
    id: "2",
    title: "Full Stack Engineer",
    company: "StartupXYZ",
    location: "Remote",
    type: "Full-time",
    salary: "$100k - $150k",
    postedDate: "1 week ago",
    description: "Join our fast-paced startup as a full stack engineer. Build scalable applications from front to back using Node.js, React, and PostgreSQL.",
    tags: ["Node.js", "React", "PostgreSQL"],
  },
  {
    id: "3",
    title: "UI/UX Designer",
    company: "Design Studio Pro",
    location: "New York, NY",
    type: "Full-time",
    salary: "$90k - $130k",
    postedDate: "3 days ago",
    description: "Create beautiful and intuitive user experiences for our clients. Work with Figma, conduct user research, and collaborate with developers.",
    tags: ["Figma", "UI Design", "User Research"],
  },
  {
    id: "4",
    title: "DevOps Engineer",
    company: "CloudSystems LLC",
    location: "Austin, TX",
    type: "Full-time",
    salary: "$110k - $160k",
    postedDate: "5 days ago",
    description: "Maintain and improve our cloud infrastructure. Experience with AWS, Kubernetes, and CI/CD pipelines required.",
    tags: ["AWS", "Kubernetes", "Docker"],
  },
  {
    id: "5",
    title: "Data Scientist",
    company: "Analytics Pro",
    location: "Boston, MA",
    type: "Full-time",
    salary: "$115k - $170k",
    postedDate: "1 day ago",
    description: "Apply machine learning and statistical analysis to solve complex business problems. Python and SQL expertise required.",
    tags: ["Python", "ML", "SQL"],
  },
];

const Jobs = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              JobFinder
            </a>
            <nav className="hidden md:flex items-center gap-6">
              <a href="/jobs" className="text-foreground hover:text-primary transition-colors font-medium">
                Find Jobs
              </a>
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

      {/* Search Section */}
      <section className="bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <SearchBar />
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Results Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">Found {mockJobs.length} jobs</h1>
            <p className="text-muted-foreground">Browse through the latest opportunities</p>
          </div>
          <div className="flex items-center gap-3">
            <Select defaultValue="recent">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="relevant">Most Relevant</SelectItem>
                <SelectItem value="salary-high">Salary: High to Low</SelectItem>
                <SelectItem value="salary-low">Salary: Low to High</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" className="md:hidden">
              <SlidersHorizontal className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <aside className="hidden lg:block">
            <FilterSidebar />
          </aside>

          {/* Job Listings */}
          <div className="lg:col-span-3 space-y-4">
            {mockJobs.map((job) => (
              <JobCard key={job.id} {...job} />
            ))}

            {/* Load More */}
            <div className="flex justify-center pt-8">
              <Button variant="outline" size="lg">
                Load More Jobs
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
