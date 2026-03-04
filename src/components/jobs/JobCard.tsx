import { Bookmark, MapPin, Briefcase, DollarSign, Clock, Users, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface JobItem {
  id: number;
  title: string;
  company: string;
  logo: string;
  location: string;
  type: string;
  salary: string;
  posted: string;
  description: string;
  fullDescription: string;
  tags: string[];
  saved: boolean;
  requirements: string[];
  benefits: string[];
  employerInfo: string;
  applicants: number;
  experienceLevel?: string;
  category?: string;
  salaryMin?: string;
  salaryMax?: string;
}

interface JobCardProps {
  job: JobItem;
  index: number;
  isSaved: boolean;
  onToggleSave: (id: number) => void;
  onApply: (job: JobItem) => void;
  onViewDetails: (job: JobItem) => void;
}

export default function JobCard({ job, index, isSaved, onToggleSave, onApply, onViewDetails }: JobCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index }}
    >
      <Card className="hover:shadow-lg transition-all cursor-pointer rounded-lg sm:rounded-xl h-full border-border/60" onClick={() => onViewDetails(job)}>
        <CardHeader className="p-3 sm:p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2.5 flex-1 min-w-0">
              <Avatar className="w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0">
                <AvatarImage src={job.logo} />
                <AvatarFallback>{job.company[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-sm sm:text-base mb-0.5 line-clamp-1">{job.title}</CardTitle>
                <CardDescription className="text-xs sm:text-sm truncate">{job.company}</CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="flex-shrink-0 w-8 h-8"
              onClick={(e) => { e.stopPropagation(); onToggleSave(job.id); }}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-primary text-primary' : ''}`} />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-3 sm:p-4 pt-0">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2 text-[10px] sm:text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
              <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{job.type}</span>
              <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{job.salary}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{job.posted}</span>
            </div>

            {job.experienceLevel && (
              <div className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground">
                <Star className="w-3 h-3" />
                <span>{job.experienceLevel}</span>
              </div>
            )}

            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{job.description}</p>

            <div className="flex flex-wrap gap-1">
              {job.tags.slice(0, 4).map(tag => (
                <Badge key={tag} variant="secondary" className="text-[9px] sm:text-[10px] px-1.5 py-0.5">{tag}</Badge>
              ))}
              {job.tags.length > 4 && (
                <Badge variant="outline" className="text-[9px] sm:text-[10px] px-1.5 py-0.5">+{job.tags.length - 4}</Badge>
              )}
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1">
                <Users className="w-3 h-3" />{job.applicants} applicants
              </span>
              <Button
                size="sm"
                className="h-7 sm:h-8 text-xs bg-gradient-to-r from-primary to-primary/80"
                onClick={(e) => { e.stopPropagation(); onApply(job); }}
              >
                Apply Now
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
