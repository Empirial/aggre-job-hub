import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { JobCard } from "@/components/JobCard";
import { SearchBar } from "@/components/SearchBar";
import { FilterSidebar } from "@/components/FilterSidebar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { SlidersHorizontal, Loader2 } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLocation, useSearchParams } from "react-router-dom";
import { useGoogleSheets, SheetJob } from "@/hooks/useGoogleSheets";
import { comprehensiveJobListings } from "@/data/jobListings";

// Use comprehensive job listings as fallback (35+ jobs)
const mockJobs = comprehensiveJobListings;

// Category editorial descriptions for SEO
const categoryDescriptions: Record<string, { title: string; description: string }> = {
  technology: {
    title: "Technology & IT Jobs",
    description: "The South African Technology and IT sector is booming, driving demand for skilled professionals in software development, data science, and cybersecurity. This category features the latest vacancies from leading tech hubs in Cape Town, Johannesburg, and remote-first companies across the country. We list roles from entry-level support to senior architecture positions, with transparent salary ranges to help you benchmark your career. Explore opportunities in FinTech, EdTech, and enterprise solutions, and find your next challenge in one of South Africa's fastest-growing industries."
  },
  government: {
    title: "Government Jobs",
    description: "South Africa's public sector offers stable employment opportunities with competitive benefits packages across all nine provinces. From municipal positions to national department roles, government jobs provide job security, pension contributions, and opportunities for career advancement. Browse the latest vacancies from DPSA, provincial governments, and state-owned enterprises, including administrative roles, healthcare positions, and technical specialists."
  },
  learnerships: {
    title: "Learnerships",
    description: "Learnerships combine practical workplace experience with theoretical learning, providing a pathway to nationally recognised qualifications. These programmes are ideal for school leavers and young professionals looking to gain skills while earning a stipend. Explore opportunities across sectors including banking, retail, manufacturing, and IT, with programmes ranging from 12 to 24 months in duration."
  },
  internships: {
    title: "Internships",
    description: "Kickstart your career with internship opportunities from leading South African companies and government departments. Internships provide valuable work experience, mentorship, and networking opportunities that can lead to permanent employment. We list graduate internships, vacation work programmes, and structured development programmes across various industries."
  }
};

const Jobs = () => {
  const [jobs, setJobs] = useState<any[]>(mockJobs);
  const [loading, setLoading] = useState(false);
  const [totalJobs, setTotalJobs] = useState(mockJobs.length);
  const [dataSource, setDataSource] = useState<'api' | 'sheet' | 'mock'>('mock');
  const { toast } = useToast();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  // Get current category from URL
  const currentCategory = useMemo(() => {
    return searchParams.get('category')?.toLowerCase() || null;
  }, [searchParams]);
  
  // Get category description if available
  const categoryInfo = useMemo(() => {
    if (currentCategory && categoryDescriptions[currentCategory]) {
      return categoryDescriptions[currentCategory];
    }
    return null;
  }, [currentCategory]);
  
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

      {/* Category Editorial Description */}
      {categoryInfo && (
        <section className="bg-muted/30 border-b border-border">
          <div className="container mx-auto px-4 py-6">
            <h2 className="text-xl font-semibold mb-3 text-foreground">{categoryInfo.title}</h2>
            <p className="text-muted-foreground leading-relaxed max-w-4xl">
              {categoryInfo.description}
            </p>
          </div>
        </section>
      )}

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
                <>
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
                  {/* Ad placeholder every 5 jobs */}
                  {(index + 1) % 5 === 0 && index !== jobs.length - 1 && (
                    <div className="bg-muted/50 border border-dashed border-muted-foreground/30 rounded-lg p-6 text-center">
                      <span className="text-xs text-muted-foreground uppercase tracking-wide">Advertisement</span>
                    </div>
                  )}
                </>
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
