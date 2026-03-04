import { Upload } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import type { JobItem } from "./JobCard";

interface ApplyJobModalProps {
  job: JobItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ApplyJobModal({ job, open, onOpenChange }: ApplyJobModalProps) {
  const [form, setForm] = useState({
    proposal: "",
    cvLink: "",
    expectedRate: "",
  });

  const handleSubmit = () => {
    if (!form.proposal.trim()) {
      toast.error("Please write a proposal message");
      return;
    }
    toast.success(`Application submitted for ${job?.title}!`);
    onOpenChange(false);
    setForm({ proposal: "", cvLink: "", expectedRate: "" });
  };

  if (!job) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[340px] sm:max-w-md md:max-w-lg rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Apply for {job.title}</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            {job.company} • {job.location}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label className="text-sm">Proposal Message <span className="text-destructive">*</span></Label>
            <Textarea
              placeholder="Tell the employer why you're the best fit for this role..."
              value={form.proposal}
              onChange={e => setForm(p => ({ ...p, proposal: e.target.value }))}
              className="min-h-[120px] text-sm resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm">CV / Portfolio Link</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Link to your CV or portfolio"
                value={form.cvLink}
                onChange={e => setForm(p => ({ ...p, cvLink: e.target.value }))}
                className="flex-1 h-10 text-sm"
              />
              <Button variant="outline" size="icon" className="h-10 w-10 flex-shrink-0" onClick={() => toast.info("File upload coming soon")}>
                <Upload className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm">Expected Rate / Salary</Label>
            <Input
              placeholder="e.g. $50/hr or $120k/year"
              value={form.expectedRate}
              onChange={e => setForm(p => ({ ...p, expectedRate: e.target.value }))}
              className="h-10 text-sm"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button className="flex-1 bg-gradient-to-r from-primary to-primary/80" onClick={handleSubmit}>
              Submit Application
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
