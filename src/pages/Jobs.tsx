import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { JobCard } from "@/components/JobCard";
import { SearchBar } from "@/components/SearchBar";
import { FilterSidebar } from "@/components/FilterSidebar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { SlidersHorizontal, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "react-router-dom";
import { useGoogleSheets, SheetJob } from "@/hooks/useGoogleSheets";

// Mock data as fallback
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
];

const Jobs = () => {
  const [jobs, setJobs] = useState<any[]>(mockJobs);
  const [loading, setLoading] = useState(false);
  const [totalJobs, setTotalJobs] = useState(mockJobs.length);
  const [dataSource, setDataSource] = useState<'api' | 'sheet' | 'mock'>('mock');
  const { toast } = useToast();
  const location = useLocation();
  
  // Fetch jobs from Google Sheets
  const { data: sheetJobs, loading: sheetLoading } = useGoogleSheets<SheetJob>('jobs');

  // Load sheet jobs on mount if available
  useEffect(() => {
    if (sheetJobs.length > 0 && dataSource === 'mock') {
      setJobs(sheetJobs);
      setTotalJobs(sheetJobs.length);
      setDataSource('sheet');
    }
  }, [sheetJobs]);

  // Handle search from home page navigation
  useEffect(() => {
    if (location.state?.keywords || location.state?.location) {
      handleSearch(location.state.keywords || '', location.state.location || '');
    }
  }, [location.state]);

  const handleSearch = async (keywords: string, searchLocation: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('search-jobs', {
        body: {
          keywords,
          location: searchLocation,
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
        setDataSource('api');
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

  const showSheetJobs = () => {
    if (sheetJobs.length > 0) {
      setJobs(sheetJobs);
      setTotalJobs(sheetJobs.length);
      setDataSource('sheet');
    }
  };

  const isLoading = loading || sheetLoading;

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
              {isLoading ? "Searching..." : `Found ${totalJobs} jobs`}
            </h1>
            <div className="flex items-center gap-2">
              <p className="text-muted-foreground">Browse through the latest opportunities</p>
              {dataSource === 'sheet' && (
                <Badge variant="outline" className="text-xs">From your spreadsheet</Badge>
              )}
              {dataSource === 'api' && (
                <Badge variant="secondary" className="text-xs">Live search results</Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {sheetJobs.length > 0 && dataSource !== 'sheet' && (
              <Button variant="outline" size="sm" onClick={showSheetJobs}>
                Show My Jobs
              </Button>
            )}
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
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading jobs...</span>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No jobs found. Try a different search.</p>
              </div>
            ) : (
              jobs.map((job, index) => (
                <JobCard 
                  key={job.url || job.id || index} 
                  id={job.id || index.toString()}
                  title={job.title}
                  company={job.company}
                  location={job.locations || job.location}
                  type={job.type || (job.salary_type === 'Y' ? 'Full-time' : 'Part-time')}
                  salary={job.salary || 'Not specified'}
                  postedDate={job.postedDate || job.date || 'Recently'}
                  description={job.description}
                  tags={job.tags || []}
                  link={job.link}
                />
              ))
            )}

            {/* Load More */}
            {jobs.length > 0 && (
              <div className="flex justify-center pt-8">
                <Button variant="outline" size="lg">
                  Load More Jobs
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Jobs;
