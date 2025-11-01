import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export const FilterSidebar = () => {
  return (
    <Card className="p-6 sticky top-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Filters</h3>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          Clear all
        </Button>
      </div>

      {/* Job Type */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">Job Type</h4>
        <div className="space-y-3">
          {["Full-time", "Part-time", "Contract", "Freelance", "Internship"].map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox id={type} />
              <Label htmlFor={type} className="text-sm cursor-pointer">
                {type}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-6" />

      {/* Experience Level */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">Experience Level</h4>
        <div className="space-y-3">
          {["Entry Level", "Mid Level", "Senior Level", "Director", "Executive"].map((level) => (
            <div key={level} className="flex items-center space-x-2">
              <Checkbox id={level} />
              <Label htmlFor={level} className="text-sm cursor-pointer">
                {level}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-6" />

      {/* Salary Range */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">Salary Range</h4>
        <div className="space-y-4">
          <Slider defaultValue={[50]} max={200} step={10} className="my-4" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>$0K</span>
            <span>$200K+</span>
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Remote Options */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">Work Location</h4>
        <div className="space-y-3">
          {["Remote", "Hybrid", "On-site"].map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox id={option} />
              <Label htmlFor={option} className="text-sm cursor-pointer">
                {option}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Button className="w-full mt-6">Apply Filters</Button>
    </Card>
  );
};
