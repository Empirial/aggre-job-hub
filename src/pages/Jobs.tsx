import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
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
    company: "Digital Solutions SA",
    location: "Sandton, Johannesburg",
    type: "Full-time",
    salary: "R720k - R1.08M",
    postedDate: "2 days ago",
    description: "We're looking for an experienced frontend developer to join our growing team. You'll work on cutting-edge web applications using React, TypeScript, and modern tooling.",
    tags: ["React", "TypeScript", "CSS"],
  },
  {
    id: "2",
    title: "Full Stack Engineer",
    company: "Cape Tech Innovations",
    location: "Remote (South Africa)",
    type: "Full-time",
    salary: "R600k - R900k",
    postedDate: "1 week ago",
    description: "Join our fast-paced startup as a full stack engineer. Build scalable applications from front to back using Node.js, React, and PostgreSQL.",
    tags: ["Node.js", "React", "PostgreSQL"],
  },
  {
    id: "3",
    title: "UI/UX Designer",
    company: "Creative Studio CT",
    location: "Cape Town CBD",
    type: "Full-time",
    salary: "R540k - R780k",
    postedDate: "3 days ago",
    description: "Create beautiful and intuitive user experiences for our clients. Work with Figma, conduct user research, and collaborate with developers.",
    tags: ["Figma", "UI Design", "User Research"],
  },
  {
    id: "4",
    title: "DevOps Engineer",
    company: "CloudSystems Africa",
    location: "Pretoria, Gauteng",
    type: "Full-time",
    salary: "R660k - R960k",
    postedDate: "5 days ago",
    description: "Maintain and improve our cloud infrastructure. Experience with AWS, Kubernetes, and CI/CD pipelines required.",
    tags: ["AWS", "Kubernetes", "Docker"],
  },
  {
    id: "5",
    title: "Data Scientist",
    company: "Analytics Pro SA",
    location: "Umhlanga, Durban",
    type: "Full-time",
    salary: "R690k - R1.02M",
    postedDate: "1 day ago",
    description: "Apply machine learning and statistical analysis to solve complex business problems. Python and SQL expertise required.",
    tags: ["Python", "ML", "SQL"],
  },
];

const Jobs = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
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

      <Footer />
    </div>
  );
};

export default Jobs;
