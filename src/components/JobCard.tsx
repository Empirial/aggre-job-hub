import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Building2, Clock, DollarSign, Bookmark, Share2 } from "lucide-react";
import { Link } from "react-router-dom";

interface JobCardProps {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary?: string;
  postedDate: string;
  description: string;
  tags: string[];
  logo?: string;
  link?: string;
}

export const JobCard = ({
  id,
  title,
  company,
  location,
  type,
  salary,
  postedDate,
  description,
  tags,
  logo,
  link,
}: JobCardProps) => {
  // Use external link if provided, otherwise use internal job detail page
  const jobLink = link || `/job/${id}`;
  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-300 border-border bg-card group">
      <div className="flex gap-4">
        {/* Company Logo */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
            {logo ? (
              <img src={logo} alt={company} className="w-full h-full object-cover rounded-lg" />
            ) : (
              <Building2 className="w-8 h-8 text-muted-foreground" />
            )}
          </div>
        </div>

        {/* Job Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-1">
              {link ? (
                <a href={link} target="_blank" rel="noopener noreferrer">
                  <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                    {title}
                  </h3>
                </a>
              ) : (
                <Link to={jobLink}>
                  <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                    {title}
                  </h3>
                </Link>
              )}
              <p className="text-muted-foreground font-medium">{company}</p>
            </div>
            <Button variant="ghost" size="icon" className="flex-shrink-0">
              <Bookmark className="w-5 h-5" />
            </Button>
          </div>

          {/* Job Info */}
          <div className="flex flex-wrap gap-4 mb-3 text-sm">
            <div className="flex items-center gap-1 text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded">
              <Clock className="w-4 h-4" />
              Closing: {postedDate}
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              {location}
            </div>
            {salary && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <DollarSign className="w-4 h-4" />
                {salary}
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-foreground/80 mb-4 line-clamp-2">{description}</p>

          {/* Tags and Actions */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{type}</Badge>
              {tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.open(`https://wa.me/?text=Check out this job: ${title} at ${company} - ${window.location.origin}/job/${id}`)}
                className="border-green-500 text-green-600 hover:bg-green-50"
              >
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </Button>
              {link ? (
                <a href={link} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" className="flex-shrink-0">
                    Apply Now
                  </Button>
                </a>
              ) : (
                <Link to={jobLink}>
                  <Button size="sm" className="flex-shrink-0">
                    View Details
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
