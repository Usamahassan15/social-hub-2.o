import { MapPin, Briefcase, DollarSign, Calendar, Users, CheckCircle, Building, Star } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { JobItem } from "./JobCard";

interface JobDetailsModalProps {
  job: JobItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (job: JobItem) => void;
}

export default function JobDetailsModal({ job, open, onOpenChange, onApply }: JobDetailsModalProps) {
  if (!job) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[360px] sm:max-w-md md:max-w-2xl max-h-[85vh] overflow-y-auto rounded-xl">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <Avatar className="w-12 h-12 sm:w-14 sm:h-14">
              <AvatarImage src={job.logo} />
              <AvatarFallback>{job.company[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <DialogTitle className="text-lg sm:text-xl">{job.title}</DialogTitle>
              <DialogDescription className="text-sm mt-1">{job.company}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-3">
          <div className="flex flex-wrap gap-3 text-xs sm:text-sm">
            <span className="flex items-center gap-1.5 text-muted-foreground"><MapPin className="w-4 h-4" />{job.location}</span>
            <span className="flex items-center gap-1.5 text-muted-foreground"><Briefcase className="w-4 h-4" />{job.type}</span>
            <span className="flex items-center gap-1.5 text-muted-foreground"><DollarSign className="w-4 h-4" />{job.salary}</span>
            <span className="flex items-center gap-1.5 text-muted-foreground"><Calendar className="w-4 h-4" />Posted {job.posted}</span>
            <span className="flex items-center gap-1.5 text-muted-foreground"><Users className="w-4 h-4" />{job.applicants} applicants</span>
            {job.experienceLevel && (
              <span className="flex items-center gap-1.5 text-muted-foreground"><Star className="w-4 h-4" />{job.experienceLevel}</span>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {job.tags.map(tag => <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>)}
          </div>

          <div>
            <h3 className="font-semibold text-sm sm:text-base mb-2">About the Role</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{job.fullDescription}</p>
          </div>

          {job.requirements.length > 0 && (
            <div>
              <h3 className="font-semibold text-sm sm:text-base mb-2">Requirements</h3>
              <ul className="space-y-1.5">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" /><span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {job.benefits.length > 0 && (
            <div>
              <h3 className="font-semibold text-sm sm:text-base mb-2">Benefits</h3>
              <ul className="space-y-1.5">
                {job.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /><span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h3 className="font-semibold text-sm sm:text-base mb-2 flex items-center gap-2">
              <Building className="w-4 h-4" />About the Employer
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">{job.employerInfo}</p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>Close</Button>
            <Button className="flex-1 bg-gradient-to-r from-primary to-primary/80" onClick={() => { onOpenChange(false); onApply(job); }}>
              Apply Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
