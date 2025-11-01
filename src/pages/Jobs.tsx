import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { JobCard } from "@/components/JobCard";
import { SearchBar } from "@/components/SearchBar";
import { FilterSidebar } from "@/components/FilterSidebar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SlidersHorizontal } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "react-router-dom";

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
  const [jobs, setJobs] = useState<any[]>(mockJobs);
  const [loading, setLoading] = useState(false);
  const [totalJobs, setTotalJobs] = useState(mockJobs.length);
  const { toast } = useToast();
  const location = useLocation();

  // Handle search from home page navigation
  useEffect(() => {
    if (location.state?.keywords || location.state?.location) {
      handleSearch(location.state.keywords || '', location.state.location || '');
    }
  }, [location.state]);

  const handleSearch = async (keywords: string, location: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('search-jobs', {
        body: {
          keywords,
          location,
          page: 1,
          pageSize: 20,
        },
      });

      if (error) throw error;

      if (data.type === 'LOCATIONS') {
        toast({
          title: "Location Clarification Needed",
          description: data.message === 'no matching location found' 
            ? "No matching location found. Please try a different location."
            : "Multiple locations found. Please be more specific.",
          variant: "destructive",
        });
        return;
      }

      if (data.type === 'JOBS') {
        setJobs(data.jobs || []);
        setTotalJobs(data.hits || 0);
        toast({
          title: "Search Complete",
          description: `Found ${data.hits || 0} matching jobs`,
        });
      }
    } catch (error: any) {
      console.error('Search error:', error);
      toast({
        title: "Search Failed",
        description: error.message || "Failed to search jobs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Search Section */}
      <section className="bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <SearchBar onSearch={handleSearch} />
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Results Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">
              {loading ? "Searching..." : `Found ${totalJobs} jobs`}
            </h1>
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
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Searching for jobs...</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No jobs found. Try a different search.</p>
              </div>
            ) : (
              jobs.map((job, index) => (
                <JobCard 
                  key={job.url || index} 
                  id={index.toString()}
                  title={job.title}
                  company={job.company}
                  location={job.locations}
                  type={job.salary_type === 'Y' ? 'Full-time' : 'Part-time'}
                  salary={job.salary || 'Not specified'}
                  postedDate={job.date}
                  description={job.description}
                  tags={[]}
                />
              ))
            )}

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
