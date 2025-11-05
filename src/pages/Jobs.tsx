import { Briefcase, MapPin, DollarSign, Clock, Bookmark, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const jobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=TC",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$120k - $180k",
    posted: "2 days ago",
    description: "We're looking for an experienced frontend developer to join our team...",
    tags: ["React", "TypeScript", "Tailwind CSS"],
    saved: false,
  },
  {
    id: 2,
    title: "UX/UI Designer",
    company: "DesignHub",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=DH",
    location: "Remote",
    type: "Contract",
    salary: "$80k - $100k",
    posted: "1 week ago",
    description: "Join our creative team to design beautiful user experiences...",
    tags: ["Figma", "UI Design", "Prototyping"],
    saved: true,
  },
  {
    id: 3,
    title: "Full Stack Engineer",
    company: "StartupXYZ",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=SX",
    location: "New York, NY",
    type: "Full-time",
    salary: "$100k - $150k",
    posted: "3 days ago",
    description: "Help us build the next generation of social media platform...",
    tags: ["Node.js", "React", "PostgreSQL"],
    saved: false,
  },
  {
    id: 4,
    title: "Product Manager",
    company: "InnovateCo",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=IC",
    location: "Austin, TX",
    type: "Full-time",
    salary: "$130k - $160k",
    posted: "5 days ago",
    description: "Lead product strategy and execution for our flagship products...",
    tags: ["Product Strategy", "Agile", "Analytics"],
    saved: false,
  },
];

export default function Jobs() {
  const [savedJobs, setSavedJobs] = useState<number[]>(jobs.filter(j => j.saved).map(j => j.id));

  const toggleSave = (jobId: number) => {
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 md:ml-64 pb-28 md:pb-6">
        <div className="max-w-4xl mx-auto px-4 pt-6">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
              Job Board
            </h1>
            <p className="text-muted-foreground">Find your next opportunity</p>
          </motion.div>

          {/* Search */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                placeholder="Search jobs, companies, or keywords..." 
                className="pl-10 h-12"
              />
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex gap-2 mb-6 overflow-x-auto pb-2"
          >
            <Button variant="outline" size="sm">All Jobs</Button>
            <Button variant="outline" size="sm">Full-time</Button>
            <Button variant="outline" size="sm">Remote</Button>
            <Button variant="outline" size="sm">Contract</Button>
            <Button variant="outline" size="sm">Saved</Button>
          </motion.div>

          {/* Jobs List */}
          <div className="space-y-4">
            {jobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="hover:shadow-lg transition-all cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <Avatar className="w-12 h-12 flex-shrink-0">
                          <AvatarImage src={job.logo} />
                          <AvatarFallback>{job.company[0]}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg mb-1">{job.title}</CardTitle>
                          <CardDescription className="text-sm">{job.company}</CardDescription>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="flex-shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSave(job.id);
                        }}
                      >
                        <Bookmark 
                          className={`w-5 h-5 ${savedJobs.includes(job.id) ? 'fill-primary text-primary' : ''}`} 
                        />
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3">
                      {/* Job Info */}
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          <span>{job.type}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          <span>{job.salary}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{job.posted}</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {job.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {job.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button className="flex-1 bg-gradient-to-r from-primary to-primary/80">
                          Apply Now
                        </Button>
                        <Button variant="outline" className="flex-1">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
