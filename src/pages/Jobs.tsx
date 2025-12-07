import { Briefcase, MapPin, DollarSign, Clock, Bookmark, Search, X, Upload, Building, Calendar, Users, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import TopBar from "@/components/TopBar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Job {
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
}

const jobs: Job[] = [
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
    fullDescription: "We're looking for an experienced frontend developer to join our dynamic team. You'll be responsible for building and maintaining user interfaces for our web applications, collaborating with designers and backend developers, and ensuring the best possible user experience.",
    tags: ["React", "TypeScript", "Tailwind CSS"],
    saved: false,
    requirements: ["5+ years of frontend development experience", "Strong proficiency in React and TypeScript", "Experience with modern CSS frameworks", "Excellent problem-solving skills"],
    benefits: ["Competitive salary and equity", "Health, dental, and vision insurance", "Flexible work arrangements", "Professional development budget"],
    employerInfo: "TechCorp Inc. is a leading technology company specializing in innovative software solutions.",
    applicants: 47,
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
    fullDescription: "Join our creative team to design beautiful user experiences that delight our customers. You'll work on a variety of projects, from mobile apps to web platforms, and have the opportunity to shape the visual direction of our products.",
    tags: ["Figma", "UI Design", "Prototyping"],
    saved: true,
    requirements: ["3+ years of UI/UX design experience", "Proficiency in Figma and design tools", "Strong portfolio showcasing design work", "Understanding of user-centered design principles"],
    benefits: ["Flexible remote work", "Creative freedom", "Collaborative team environment", "Regular design workshops"],
    employerInfo: "DesignHub is a creative agency focused on delivering exceptional digital experiences.",
    applicants: 32,
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
    fullDescription: "Help us build the next generation of social media platform. As a Full Stack Engineer, you'll work on both frontend and backend systems, contributing to the architecture and implementation of new features that will be used by millions of users.",
    tags: ["Node.js", "React", "PostgreSQL"],
    saved: false,
    requirements: ["4+ years of full-stack development experience", "Experience with Node.js and React", "Database design and optimization skills", "Familiarity with cloud platforms (AWS/GCP)"],
    benefits: ["Equity package", "Unlimited PTO", "Home office stipend", "Weekly team events"],
    employerInfo: "StartupXYZ is a fast-growing startup revolutionizing social media.",
    applicants: 89,
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
    fullDescription: "Lead product strategy and execution for our flagship products. You'll work closely with engineering, design, and business teams to define product roadmaps, prioritize features, and drive product launches that meet customer needs and business goals.",
    tags: ["Product Strategy", "Agile", "Analytics"],
    saved: false,
    requirements: ["5+ years of product management experience", "Strong analytical and data-driven mindset", "Experience with Agile methodologies", "Excellent communication and leadership skills"],
    benefits: ["Competitive compensation", "Stock options", "Health and wellness programs", "Career growth opportunities"],
    employerInfo: "InnovateCo is an innovation-driven company building cutting-edge enterprise solutions.",
    applicants: 56,
  },
];

export default function Jobs() {
  const [savedJobs, setSavedJobs] = useState<number[]>(jobs.filter(j => j.saved).map(j => j.id));
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [applicationData, setApplicationData] = useState({
    fullName: "",
    email: "",
    resumeLink: "",
    coverNote: "",
  });

  const toggleSave = (jobId: number) => {
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const handleApply = (job: Job) => {
    setSelectedJob(job);
    setShowApplyModal(true);
  };

  const handleViewDetails = (job: Job) => {
    setSelectedJob(job);
    setShowDetailsModal(true);
  };

  const submitApplication = () => {
    if (!applicationData.fullName || !applicationData.email) {
      toast.error("Please fill in required fields");
      return;
    }
    toast.success(`Application submitted for ${selectedJob?.title}!`);
    setShowApplyModal(false);
    setApplicationData({ fullName: "", email: "", resumeLink: "", coverNote: "" });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <TopBar />
      
      <main className="flex-1 md:ml-64 pb-16 md:pb-8 pt-14 md:pt-0">
        <div className="w-full max-w-[340px] sm:max-w-md md:max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto px-3 sm:px-4 md:px-6 pt-3 sm:pt-4 md:pt-6">
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

          {/* Jobs List - Responsive Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-5">
            {jobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="hover:shadow-lg transition-all cursor-pointer rounded-lg sm:rounded-xl h-full">
                  <CardHeader className="p-3 sm:p-4 md:p-5">
                    <div className="flex items-start justify-between gap-2 sm:gap-3">
                      <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                        <Avatar className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 flex-shrink-0">
                          <AvatarImage src={job.logo} />
                          <AvatarFallback>{job.company[0]}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-sm sm:text-base md:text-lg mb-0.5 line-clamp-1">{job.title}</CardTitle>
                          <CardDescription className="text-xs sm:text-sm truncate">{job.company}</CardDescription>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9"
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

                  <CardContent className="p-3 sm:p-4 md:p-5 pt-0">
                    <div className="space-y-2 sm:space-y-3">
                      {/* Job Info */}
                      <div className="flex flex-wrap gap-2 sm:gap-3 text-[10px] sm:text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-3 h-3 flex-shrink-0" />
                          <span>{job.type}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3 flex-shrink-0" />
                          <span className="whitespace-nowrap">{job.salary}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 flex-shrink-0" />
                          <span>{job.posted}</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                        {job.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 sm:gap-1.5">
                        {job.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-[9px] sm:text-[10px] px-1.5 py-0.5">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-1 sm:pt-2">
                        <Button 
                          className="flex-1 bg-gradient-to-r from-primary to-primary/80 h-8 sm:h-9 text-xs sm:text-sm"
                          onClick={() => handleApply(job)}
                        >
                          Apply Now
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1 h-8 sm:h-9 text-xs sm:text-sm"
                          onClick={() => handleViewDetails(job)}
                        >
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

      {/* Apply Now Modal */}
      <Dialog open={showApplyModal} onOpenChange={setShowApplyModal}>
        <DialogContent className="max-w-[340px] sm:max-w-md md:max-w-lg rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Apply for {selectedJob?.title}</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              {selectedJob?.company} • {selectedJob?.location}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm">Full Name *</Label>
              <Input 
                id="fullName"
                placeholder="Enter your full name"
                value={applicationData.fullName}
                onChange={(e) => setApplicationData(prev => ({ ...prev, fullName: e.target.value }))}
                className="h-10 text-sm"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm">Contact Email *</Label>
              <Input 
                id="email"
                type="email"
                placeholder="your@email.com"
                value={applicationData.email}
                onChange={(e) => setApplicationData(prev => ({ ...prev, email: e.target.value }))}
                className="h-10 text-sm"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="resume" className="text-sm">Resume Link / Upload</Label>
              <div className="flex gap-2">
                <Input 
                  id="resume"
                  placeholder="Link to your resume or portfolio"
                  value={applicationData.resumeLink}
                  onChange={(e) => setApplicationData(prev => ({ ...prev, resumeLink: e.target.value }))}
                  className="flex-1 h-10 text-sm"
                />
                <Button variant="outline" size="icon" className="h-10 w-10 flex-shrink-0">
                  <Upload className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="coverNote" className="text-sm">Cover Note</Label>
              <Textarea 
                id="coverNote"
                placeholder="Tell us why you're a great fit for this role..."
                value={applicationData.coverNote}
                onChange={(e) => setApplicationData(prev => ({ ...prev, coverNote: e.target.value }))}
                className="min-h-[100px] text-sm resize-none"
              />
            </div>
            
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowApplyModal(false)}>
                Cancel
              </Button>
              <Button className="flex-1 bg-gradient-to-r from-primary to-primary/80" onClick={submitApplication}>
                Submit Application
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-[340px] sm:max-w-md md:max-w-2xl max-h-[85vh] overflow-y-auto rounded-xl">
          {selectedJob && (
            <>
              <DialogHeader>
                <div className="flex items-start gap-3 sm:gap-4">
                  <Avatar className="w-12 h-12 sm:w-14 sm:h-14">
                    <AvatarImage src={selectedJob.logo} />
                    <AvatarFallback>{selectedJob.company[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <DialogTitle className="text-lg sm:text-xl md:text-2xl">{selectedJob.title}</DialogTitle>
                    <DialogDescription className="text-sm sm:text-base mt-1">
                      {selectedJob.company}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="space-y-4 sm:space-y-5 pt-3">
                {/* Quick Info */}
                <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedJob.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Briefcase className="w-4 h-4" />
                    <span>{selectedJob.type}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <DollarSign className="w-4 h-4" />
                    <span>{selectedJob.salary}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Posted {selectedJob.posted}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{selectedJob.applicants} applicants</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {selectedJob.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-semibold text-sm sm:text-base mb-2">About the Role</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {selectedJob.fullDescription}
                  </p>
                </div>

                {/* Requirements */}
                <div>
                  <h3 className="font-semibold text-sm sm:text-base mb-2">Requirements</h3>
                  <ul className="space-y-1.5">
                    {selectedJob.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Benefits */}
                <div>
                  <h3 className="font-semibold text-sm sm:text-base mb-2">Benefits</h3>
                  <ul className="space-y-1.5">
                    {selectedJob.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Employer Info */}
                <div>
                  <h3 className="font-semibold text-sm sm:text-base mb-2 flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    About the Employer
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {selectedJob.employerInfo}
                  </p>
                </div>

                {/* CTA */}
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" className="flex-1" onClick={() => setShowDetailsModal(false)}>
                    Close
                  </Button>
                  <Button 
                    className="flex-1 bg-gradient-to-r from-primary to-primary/80"
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleApply(selectedJob);
                    }}
                  >
                    Apply Now
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}