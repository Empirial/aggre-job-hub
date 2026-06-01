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
  const jobLink = link || `/job/${id}`;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-border hover:shadow-md transition-all duration-200 group">
      <div className="flex gap-4">
        {/* Company Logo */}
        <div className="flex-shrink-0">
          <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center border border-border">
            {logo ? (
              <img src={logo} alt={company} className="w-full h-full object-cover rounded-xl" />
            ) : (
              <Building2 className="w-6 h-6 text-muted-foreground" />
            )}
          </div>
        </div>

        {/* Job Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-1.5">
            <div className="flex-1 min-w-0">
              {link ? (
                <a href={link} target="_blank" rel="noopener noreferrer">
                  <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                    {title}
                  </h3>
                </a>
              ) : (
                <Link to={jobLink}>
                  <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                    {title}
                  </h3>
                </Link>
              )}
              <p className="text-sm text-muted-foreground mt-0.5">{company}</p>
            </div>
            <button className="p-1.5 rounded-lg hover:bg-muted transition-colors flex-shrink-0">
              <Bookmark className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap gap-3 mb-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {location}
            </span>
            {salary && (
              <span className="flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5" />
                {salary}
              </span>
            )}
            <span className="flex items-center gap-1 text-red-500 font-medium">
              <Clock className="w-3.5 h-3.5" />
              {postedDate}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
            {description}
          </p>

          {/* Tags + Actions */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2.5 py-0.5 rounded-lg bg-primary/10 text-primary text-xs font-medium">
                {type}
              </span>
              {tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded-lg bg-muted text-muted-foreground text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() =>
                  window.open(
                    `https://wa.me/?text=Check out this job: ${title} at ${company} - ${window.location.origin}/job/${id}`
                  )
                }
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-emerald-200 text-emerald-600 text-xs font-medium hover:bg-emerald-50 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                Share
              </button>

              {link ? (
                <a href={link} target="_blank" rel="noopener noreferrer">
                  <button className="px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-medium hover:bg-primary/90 transition-colors shadow-sm">
                    Apply Now
                  </button>
                </a>
              ) : (
                <Link to={jobLink}>
                  <button className="px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-medium hover:bg-primary/90 transition-colors shadow-sm">
                    View Details
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
