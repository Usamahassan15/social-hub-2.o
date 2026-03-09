import { useState } from "react";
import { Plus, FileText, Clock, DollarSign, Users, Pencil, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const initialProjects = [
  { id: 1, title: "E-commerce Platform", budget: "$2,000-$5,000", deadline: "Mar 30, 2026", proposals: 8, status: "Open" },
  { id: 2, title: "Mobile App UI Design", budget: "$500-$1,000", deadline: "Apr 15, 2026", proposals: 12, status: "In Progress" },
  { id: 3, title: "SEO & Content Strategy", budget: "$300-$800", deadline: "Mar 20, 2026", proposals: 5, status: "Open" },
  { id: 4, title: "Brand Identity Package", budget: "$1,000-$2,000", deadline: "Apr 1, 2026", proposals: 3, status: "Closed" },
  { id: 5, title: "API Integration Service", budget: "$800-$1,500", deadline: "Mar 25, 2026", proposals: 6, status: "Open" },
];

const statusColor: Record<string, string> = {
  "Open": "bg-emerald-500/10 text-emerald-600",
  "In Progress": "bg-amber-500/10 text-amber-600",
  "Closed": "bg-muted text-muted-foreground",
};

export default function BuyerProjects() {
  const [projects, setProjects] = useState(initialProjects);
  const [showCreate, setShowCreate] = useState(false);
  const [newProject, setNewProject] = useState({ title: "", description: "", budget: "", deadline: "", category: "" });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">My Projects</h2>
          <p className="text-sm text-muted-foreground">{projects.length} projects</p>
        </div>
        <Button className="gap-2" onClick={() => setShowCreate(true)}>
          <Plus className="w-4 h-4" /> Post Project
        </Button>
      </div>

      <div className="space-y-3">
        {projects.map((project, i) => (
          <motion.div key={project.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="border-border/50 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-foreground">{project.title}</h3>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{project.budget}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{project.deadline}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{project.proposals} proposals</span>
                    </div>
                  </div>
                  <Badge className={`text-[10px] ${statusColor[project.status] || ""} border-0`}>{project.status}</Badge>
                </div>
                <div className="flex gap-2 mt-3 pt-2 border-t border-border/30">
                  <Button variant="outline" size="sm" className="text-xs h-7 gap-1"><FileText className="w-3 h-3" /> View Proposals</Button>
                  <Button variant="ghost" size="sm" className="text-xs h-7 gap-1"><Pencil className="w-3 h-3" /> Edit</Button>
                  {project.status !== "Closed" && (
                    <Button variant="ghost" size="sm" className="text-xs h-7 gap-1 text-destructive" onClick={() => {
                      setProjects(prev => prev.map(p => p.id === project.id ? { ...p, status: "Closed" } : p));
                      toast({ title: "Project closed" });
                    }}><XCircle className="w-3 h-3" /> Close</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Post New Project</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-3">
            <div><Label>Project Title</Label><Input placeholder="E.g., Build a landing page" value={newProject.title} onChange={e => setNewProject({ ...newProject, title: e.target.value })} /></div>
            <div><Label>Category</Label>
              <Select value={newProject.category} onValueChange={v => setNewProject({ ...newProject, category: v })}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {["Design", "Development", "Marketing", "Writing", "Video", "Music"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Budget Range</Label><Input placeholder="$500-$1,000" value={newProject.budget} onChange={e => setNewProject({ ...newProject, budget: e.target.value })} /></div>
              <div><Label>Deadline</Label><Input type="date" value={newProject.deadline} onChange={e => setNewProject({ ...newProject, deadline: e.target.value })} /></div>
            </div>
            <div><Label>Description</Label><Textarea placeholder="Describe your project requirements..." value={newProject.description} onChange={e => setNewProject({ ...newProject, description: e.target.value })} rows={4} /></div>
            <Button className="w-full" onClick={() => { toast({ title: "Project posted!" }); setShowCreate(false); }}>Post Project</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
