import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";

interface SearchBarProps {
  variant?: "hero" | "default";
}

export const SearchBar = ({ variant = "default" }: SearchBarProps) => {
  const isHero = variant === "hero";

  return (
    <div className={`w-full ${isHero ? "max-w-4xl mx-auto" : ""}`}>
      <div className={`flex flex-col sm:flex-row gap-3 ${isHero ? "bg-card p-4 rounded-2xl shadow-xl" : ""}`}>
        {/* Job Title / Keywords */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            placeholder="Job title, keywords, or company"
            className={`pl-10 ${isHero ? "h-14 text-lg border-none" : "h-12"}`}
          />
        </div>

        {/* Location */}
        <div className="flex-1 relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            placeholder="City, province, or remote"
            className={`pl-10 ${isHero ? "h-14 text-lg border-none" : "h-12"}`}
          />
        </div>

        {/* Search Button */}
        <Button size={isHero ? "lg" : "default"} className={isHero ? "h-14 px-8 text-lg" : "h-12"}>
          <Search className="w-5 h-5 mr-2" />
          Search Jobs
        </Button>
      </div>
    </div>
  );
};
