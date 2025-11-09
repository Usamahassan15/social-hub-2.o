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
      
      <main className="flex-1 pb-20 sm:pb-24 md:pb-8 lg:pb-10">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pt-4 sm:pt-5 md:pt-6 lg:pt-8">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 sm:mb-5 md:mb-6 lg:mb-8"
          >
            <h1 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-1 sm:mb-2">
              Job Board
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">Find your next opportunity</p>
          </motion.div>

          {/* Search */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-4 sm:mb-5 md:mb-6"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
              <Input 
                placeholder="Search jobs, companies, or keywords..." 
                className="pl-9 sm:pl-10 h-10 sm:h-11 md:h-12 text-sm sm:text-base rounded-lg"
              />
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex gap-2 sm:gap-2.5 md:gap-3 mb-4 sm:mb-5 md:mb-6 overflow-x-auto pb-2 scrollbar-hide"
          >
            <Button variant="outline" size="sm" className="whitespace-nowrap text-xs sm:text-sm">All Jobs</Button>
            <Button variant="outline" size="sm" className="whitespace-nowrap text-xs sm:text-sm">Full-time</Button>
            <Button variant="outline" size="sm" className="whitespace-nowrap text-xs sm:text-sm">Remote</Button>
            <Button variant="outline" size="sm" className="whitespace-nowrap text-xs sm:text-sm">Contract</Button>
            <Button variant="outline" size="sm" className="whitespace-nowrap text-xs sm:text-sm">Saved</Button>
          </motion.div>

          {/* Jobs List */}
          <div className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
            {jobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="hover:shadow-lg transition-all cursor-pointer rounded-lg sm:rounded-xl">
                  <CardHeader className="p-4 sm:p-5 md:p-6">
                    <div className="flex items-start justify-between gap-3 sm:gap-4">
                      <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                        <Avatar className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex-shrink-0">
                          <AvatarImage src={job.logo} />
                          <AvatarFallback>{job.company[0]}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base sm:text-lg md:text-xl mb-0.5 sm:mb-1 truncate">{job.title}</CardTitle>
                          <CardDescription className="text-xs sm:text-sm truncate">{job.company}</CardDescription>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSave(job.id);
                        }}
                      >
                        <Bookmark 
                          className={`w-4 h-4 sm:w-5 sm:h-5 ${savedJobs.includes(job.id) ? 'fill-primary text-primary' : ''}`} 
                        />
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 sm:p-5 md:p-6 pt-0">
                    <div className="space-y-2.5 sm:space-y-3 md:space-y-4">
                      {/* Job Info */}
                      <div className="flex flex-wrap gap-3 sm:gap-4 md:gap-5 text-xs sm:text-sm text-muted-foreground">
                        <div className="flex items-center gap-1 sm:gap-1.5">
                          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="truncate">{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-1.5">
                          <Briefcase className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span>{job.type}</span>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-1.5">
                          <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="whitespace-nowrap">{job.salary}</span>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-1.5">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span>{job.posted}</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                        {job.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {job.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-[10px] sm:text-xs px-2 py-0.5 sm:px-2.5 sm:py-1">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-2.5 md:gap-3 pt-2 sm:pt-3">
                        <Button className="flex-1 bg-gradient-to-r from-primary to-primary/80 h-9 sm:h-10 text-sm sm:text-base">
                          Apply Now
                        </Button>
                        <Button variant="outline" className="flex-1 h-9 sm:h-10 text-sm sm:text-base">
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
