import { useState } from "react";
import { X, Plus, Paperclip, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export interface PostedJob {
  id: number;
  title: string;
  category: string;
  type: string;
  salaryMin: string;
  salaryMax: string;
  experienceLevel: string;
  skills: string[];
  description: string;
  location: string;
  deadline: string;
  status: "published" | "draft";
  postedAt: Date;
  applicants: number;
  saved: boolean;
}

interface PostJobModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPost: (job: PostedJob) => void;
}

const categories = [
  "Engineering", "Design", "Marketing", "Sales", "Product", "Finance",
  "HR", "Operations", "Customer Support", "Data Science", "Other"
];

const jobTypes = ["Full-time", "Part-time", "Contract", "Remote", "Freelance"];
const experienceLevels = ["Entry Level", "Intermediate", "Expert", "Lead / Manager"];

export default function PostJobModal({ open, onOpenChange, onPost }: PostJobModalProps) {
  const [form, setForm] = useState({
    title: "",
    category: "",
    type: "",
    salaryMin: "",
    salaryMax: "",
    experienceLevel: "",
    description: "",
    location: "",
    deadline: "",
  });
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [attachments, setAttachments] = useState<string[]>([]);

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills(prev => [...prev, trimmed]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(prev => prev.filter(s => s !== skill));
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const resetForm = () => {
    setForm({ title: "", category: "", type: "", salaryMin: "", salaryMax: "", experienceLevel: "", description: "", location: "", deadline: "" });
    setSkills([]);
    setSkillInput("");
    setAttachments([]);
  };

  const handleSubmit = (status: "published" | "draft") => {
    if (!form.title.trim()) {
      toast.error("Job title is required");
      return;
    }
    if (status === "published" && !form.description.trim()) {
      toast.error("Job description is required to publish");
      return;
    }

    const job: PostedJob = {
      id: Date.now(),
      title: form.title,
      category: form.category || "Other",
      type: form.type || "Full-time",
      salaryMin: form.salaryMin,
      salaryMax: form.salaryMax,
      experienceLevel: form.experienceLevel || "Intermediate",
      skills,
      description: form.description,
      location: form.location || "Remote",
      deadline: form.deadline,
      status,
      postedAt: new Date(),
      applicants: 0,
      saved: false,
    };

    onPost(job);
    resetForm();
    onOpenChange(false);
    toast.success(status === "published" ? "Job published successfully!" : "Job saved as draft");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[360px] sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-bold">Post a Job</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
            Fill in the details below to create a job listing
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Title */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Job Title <span className="text-destructive">*</span></Label>
            <Input
              placeholder="e.g. Senior Frontend Developer"
              value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              className="h-10 text-sm"
            />
          </div>

          {/* Category & Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Category</Label>
              <Select value={form.category} onValueChange={v => setForm(p => ({ ...p, category: v }))}>
                <SelectTrigger className="h-10 text-sm">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Job Type</Label>
              <Select value={form.type} onValueChange={v => setForm(p => ({ ...p, type: v }))}>
                <SelectTrigger className="h-10 text-sm">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {jobTypes.map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Salary & Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Budget / Salary Range</Label>
              <div className="flex gap-2 items-center">
                <Input
                  placeholder="Min"
                  value={form.salaryMin}
                  onChange={e => setForm(p => ({ ...p, salaryMin: e.target.value }))}
                  className="h-10 text-sm"
                />
                <span className="text-muted-foreground text-sm">–</span>
                <Input
                  placeholder="Max"
                  value={form.salaryMax}
                  onChange={e => setForm(p => ({ ...p, salaryMax: e.target.value }))}
                  className="h-10 text-sm"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Experience Level</Label>
              <Select value={form.experienceLevel} onValueChange={v => setForm(p => ({ ...p, experienceLevel: v }))}>
                <SelectTrigger className="h-10 text-sm">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {experienceLevels.map(l => (
                    <SelectItem key={l} value={l}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Skills Required</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Type a skill and press Enter"
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                className="h-10 text-sm flex-1"
              />
              <Button type="button" variant="outline" size="icon" className="h-10 w-10 flex-shrink-0" onClick={addSkill}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {skills.map(skill => (
                  <Badge key={skill} variant="secondary" className="text-xs gap-1 pr-1">
                    {skill}
                    <button onClick={() => removeSkill(skill)} className="ml-0.5 hover:text-destructive">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Job Description <span className="text-destructive">*</span></Label>
            <Textarea
              placeholder="Describe the role, responsibilities, and what you're looking for..."
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              className="min-h-[120px] text-sm resize-none"
            />
          </div>

          {/* Location & Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Location</Label>
              <Input
                placeholder="e.g. Remote, New York, NY"
                value={form.location}
                onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                className="h-10 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Deadline</Label>
              <Input
                type="date"
                value={form.deadline}
                onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))}
                className="h-10 text-sm"
              />
            </div>
          </div>

          {/* Attachments */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Attachments (Optional)</Label>
            <Button variant="outline" className="w-full h-10 text-sm gap-2 text-muted-foreground" onClick={() => toast.info("File upload coming soon")}>
              <Paperclip className="w-4 h-4" />
              Add attachments
            </Button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-3 border-t">
            <Button variant="outline" className="flex-1 text-sm" onClick={() => handleSubmit("draft")}>
              Save as Draft
            </Button>
            <Button className="flex-1 text-sm bg-gradient-to-r from-primary to-primary/80" onClick={() => handleSubmit("published")}>
              Publish Job
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
