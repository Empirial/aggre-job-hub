import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { JobCard } from "@/components/JobCard";
import { SearchBar } from "@/components/SearchBar";
import { FilterSidebar } from "@/components/FilterSidebar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { SlidersHorizontal } from "lucide-react";
import { useState, useMemo } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { comprehensiveJobListings } from "@/data/jobListings";

const categoryDescriptions: Record<string, { title: string; description: string }> = {
  technology: {
    title: "Technology & IT Jobs",
    description: "The South African Technology and IT sector is booming, driving demand for skilled professionals in software development, data science, and cybersecurity. This category features the latest vacancies from leading tech hubs in Cape Town, Johannesburg, and remote-first companies across the country.",
  },
  government: {
    title: "Government Jobs",
    description: "South Africa's public sector offers stable employment opportunities with competitive benefits packages across all nine provinces. Browse the latest vacancies from DPSA, provincial governments, and state-owned enterprises.",
  },
  learnerships: {
    title: "Learnerships",
    description: "Learnerships combine practical workplace experience with theoretical learning, providing a pathway to nationally recognised qualifications. Explore opportunities across banking, retail, manufacturing, and IT.",
  },
  internships: {
    title: "Internships",
    description: "Kickstart your career with internship opportunities from leading South African companies and government departments. We list graduate internships, vacation work programmes, and structured development programmes.",
  },
};

const Jobs = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState("recent");

  const currentCategory = useMemo(
    () => searchParams.get("category")?.toLowerCase() || null,
    [searchParams]
  );

  const categoryInfo = currentCategory ? categoryDescriptions[currentCategory] ?? null : null;

  // Keywords and location from search bar navigation
  const navKeywords: string = location.state?.keywords || "";
  const navLocation: string = location.state?.location || "";

  const filtered = useMemo(() => {
    let list = [...comprehensiveJobListings];

    if (currentCategory) {
      list = list.filter((j) =>
        j.type?.toLowerCase().includes(currentCategory) ||
        j.tags?.some((t: string) => t.toLowerCase().includes(currentCategory)) ||
        j.title?.toLowerCase().includes(currentCategory)
      );
    }

    if (navKeywords) {
      const kw = navKeywords.toLowerCase();
      list = list.filter(
        (j) =>
          j.title?.toLowerCase().includes(kw) ||
          j.company?.toLowerCase().includes(kw) ||
          j.description?.toLowerCase().includes(kw) ||
          j.tags?.some((t: string) => t.toLowerCase().includes(kw))
      );
    }

    if (navLocation) {
      const loc = navLocation.toLowerCase();
      list = list.filter((j) => j.location?.toLowerCase().includes(loc));
    }

    return list;
  }, [currentCategory, navKeywords, navLocation]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Search Section */}
      <section className="bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <SearchBar onSearch={() => {}} />
        </div>
      </section>

      {/* Category Description */}
      {categoryInfo && (
        <section className="bg-muted/30 border-b border-border">
          <div className="container mx-auto px-4 py-6">
            <h2 className="text-xl font-semibold mb-3 text-foreground">{categoryInfo.title}</h2>
            <p className="text-muted-foreground leading-relaxed max-w-4xl">{categoryInfo.description}</p>
          </div>
        </section>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">Found {filtered.length} jobs</h1>
            <p className="text-muted-foreground">Browse through the latest opportunities</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="relevant">Most Relevant</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" className="md:hidden">
              <SlidersHorizontal className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="hidden lg:block">
            <FilterSidebar />
          </aside>

          <div className="lg:col-span-3 space-y-4">
            {filtered.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No jobs found. Try a different search.</p>
              </div>
            ) : (
              filtered.map((job, index) => (
                <div key={job.id || index}>
                  <JobCard
                    id={job.id || String(index)}
                    title={job.title}
                    company={job.company}
                    location={job.location}
                    type={job.type}
                    salary={job.salary || "Not specified"}
                    postedDate={job.postedDate || "Recently"}
                    description={job.description}
                    tags={job.tags || []}
                    link={job.link}
                  />
                  {(index + 1) % 5 === 0 && index !== filtered.length - 1 && (
                    <div className="bg-muted/50 border border-dashed border-muted-foreground/30 rounded-lg p-6 text-center">
                      <span className="text-xs text-muted-foreground uppercase tracking-wide">Advertisement</span>
                    </div>
                  )}
                </div>
              ))
            )}

            {filtered.length > 0 && (
              <div className="flex justify-center pt-8">
                <Button variant="outline" size="lg">Load More Jobs</Button>
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
