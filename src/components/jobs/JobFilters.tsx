import { Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

interface JobFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  categoryFilter: string;
  onCategoryChange: (c: string) => void;
  typeFilter: string;
  onTypeChange: (t: string) => void;
  experienceFilter: string;
  onExperienceChange: (e: string) => void;
  sortBy: string;
  onSortChange: (s: string) => void;
}

const categories = ["All", "Engineering", "Design", "Marketing", "Sales", "Product", "Finance", "HR", "Operations", "Customer Support", "Data Science", "Other"];
const jobTypes = ["All", "Full-time", "Part-time", "Contract", "Remote", "Freelance"];
const experienceLevels = ["All", "Entry Level", "Intermediate", "Expert", "Lead / Manager"];

export default function JobFilters({
  searchQuery, onSearchChange,
  categoryFilter, onCategoryChange,
  typeFilter, onTypeChange,
  experienceFilter, onExperienceChange,
  sortBy, onSortChange,
}: JobFiltersProps) {
  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search jobs, companies, or keywords..."
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          className="pl-9 h-10 sm:h-11 text-sm rounded-lg"
        />
      </div>

      {/* Filter & Sort Row */}
      <div className="flex gap-2 items-center flex-wrap">
        {/* Filters Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs sm:text-sm">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-4 space-y-3" align="start">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Category</Label>
              <Select value={categoryFilter} onValueChange={onCategoryChange}>
                <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Job Type</Label>
              <Select value={typeFilter} onValueChange={onTypeChange}>
                <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {jobTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Experience Level</Label>
              <Select value={experienceFilter} onValueChange={onExperienceChange}>
                <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {experienceLevels.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </PopoverContent>
        </Popover>

        {/* Quick type filters */}
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
          {["All", "Full-time", "Remote", "Contract"].map(t => (
            <Button
              key={t}
              variant={typeFilter === t ? "default" : "outline"}
              size="sm"
              className="whitespace-nowrap text-xs"
              onClick={() => onTypeChange(t)}
            >
              {t}
            </Button>
          ))}
        </div>

        {/* Sort */}
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="h-8 w-auto min-w-[130px] text-xs gap-1 ml-auto">
            <ArrowUpDown className="w-3 h-3" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Latest First</SelectItem>
            <SelectItem value="salary-high">Budget: High-Low</SelectItem>
            <SelectItem value="salary-low">Budget: Low-High</SelectItem>
            <SelectItem value="applicants">Most Applicants</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
