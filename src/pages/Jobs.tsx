import { Plus, Briefcase, FileText, Heart, Send } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import TopBar from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import JobCard, { type JobItem } from "@/components/jobs/JobCard";
import JobFilters from "@/components/jobs/JobFilters";
import PostJobModal, { type PostedJob } from "@/components/jobs/PostJobModal";
import JobDetailsModal from "@/components/jobs/JobDetailsModal";
import ApplyJobModal from "@/components/jobs/ApplyJobModal";

const sampleJobs: JobItem[] = [
  {
    id: 1, title: "Senior Frontend Developer", company: "TechCorp Inc.",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=TC", location: "San Francisco, CA",
    type: "Full-time", salary: "$120k - $180k", posted: "2 days ago",
    description: "We're looking for an experienced frontend developer to join our team...",
    fullDescription: "We're looking for an experienced frontend developer to join our dynamic team. You'll be responsible for building and maintaining user interfaces for our web applications, collaborating with designers and backend developers, and ensuring the best possible user experience.",
    tags: ["React", "TypeScript", "Tailwind CSS"], saved: false,
    requirements: ["5+ years of frontend development experience", "Strong proficiency in React and TypeScript", "Experience with modern CSS frameworks", "Excellent problem-solving skills"],
    benefits: ["Competitive salary and equity", "Health, dental, and vision insurance", "Flexible work arrangements", "Professional development budget"],
    employerInfo: "TechCorp Inc. is a leading technology company specializing in innovative software solutions.",
    applicants: 47, experienceLevel: "Expert", category: "Engineering",
  },
  {
    id: 2, title: "UX/UI Designer", company: "DesignHub",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=DH", location: "Remote",
    type: "Contract", salary: "$80k - $100k", posted: "1 week ago",
    description: "Join our creative team to design beautiful user experiences...",
    fullDescription: "Join our creative team to design beautiful user experiences that delight our customers. You'll work on a variety of projects, from mobile apps to web platforms, and have the opportunity to shape the visual direction of our products.",
    tags: ["Figma", "UI Design", "Prototyping"], saved: true,
    requirements: ["3+ years of UI/UX design experience", "Proficiency in Figma and design tools", "Strong portfolio showcasing design work", "Understanding of user-centered design principles"],
    benefits: ["Flexible remote work", "Creative freedom", "Collaborative team environment", "Regular design workshops"],
    employerInfo: "DesignHub is a creative agency focused on delivering exceptional digital experiences.",
    applicants: 32, experienceLevel: "Intermediate", category: "Design",
  },
  {
    id: 3, title: "Full Stack Engineer", company: "StartupXYZ",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=SX", location: "New York, NY",
    type: "Full-time", salary: "$100k - $150k", posted: "3 days ago",
    description: "Help us build the next generation of social media platform...",
    fullDescription: "Help us build the next generation of social media platform. As a Full Stack Engineer, you'll work on both frontend and backend systems, contributing to the architecture and implementation of new features that will be used by millions of users.",
    tags: ["Node.js", "React", "PostgreSQL"], saved: false,
    requirements: ["4+ years of full-stack development experience", "Experience with Node.js and React", "Database design and optimization skills", "Familiarity with cloud platforms (AWS/GCP)"],
    benefits: ["Equity package", "Unlimited PTO", "Home office stipend", "Weekly team events"],
    employerInfo: "StartupXYZ is a fast-growing startup revolutionizing social media.",
    applicants: 89, experienceLevel: "Intermediate", category: "Engineering",
  },
  {
    id: 4, title: "Product Manager", company: "InnovateCo",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=IC", location: "Austin, TX",
    type: "Full-time", salary: "$130k - $160k", posted: "5 days ago",
    description: "Lead product strategy and execution for our flagship products...",
    fullDescription: "Lead product strategy and execution for our flagship products. You'll work closely with engineering, design, and business teams to define product roadmaps, prioritize features, and drive product launches that meet customer needs and business goals.",
    tags: ["Product Strategy", "Agile", "Analytics"], saved: false,
    requirements: ["5+ years of product management experience", "Strong analytical and data-driven mindset", "Experience with Agile methodologies", "Excellent communication and leadership skills"],
    benefits: ["Competitive compensation", "Stock options", "Health and wellness programs", "Career growth opportunities"],
    employerInfo: "InnovateCo is an innovation-driven company building cutting-edge enterprise solutions.",
    applicants: 56, experienceLevel: "Expert", category: "Product",
  },
];

export default function Jobs() {
  const [activeTab, setActiveTab] = useState("all");
  const [savedJobIds, setSavedJobIds] = useState<number[]>([2]);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobItem | null>(null);
  const [myPostedJobs, setMyPostedJobs] = useState<JobItem[]>([]);
  const [myApplications, setMyApplications] = useState<number[]>([]);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [experienceFilter, setExperienceFilter] = useState("All");
  const [sortBy, setSortBy] = useState("latest");

  const allJobs = useMemo(() => [...sampleJobs, ...myPostedJobs], [myPostedJobs]);

  const filteredJobs = useMemo(() => {
    let result = allJobs;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(j =>
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.tags.some(t => t.toLowerCase().includes(q)) ||
        j.description.toLowerCase().includes(q)
      );
    }
    if (categoryFilter !== "All") result = result.filter(j => j.category === categoryFilter);
    if (typeFilter !== "All") result = result.filter(j => j.type === typeFilter);
    if (experienceFilter !== "All") result = result.filter(j => j.experienceLevel === experienceFilter);

    // Sort
    if (sortBy === "salary-high") result = [...result].sort((a, b) => parseInt(b.salary.replace(/\D/g, "")) - parseInt(a.salary.replace(/\D/g, "")));
    else if (sortBy === "salary-low") result = [...result].sort((a, b) => parseInt(a.salary.replace(/\D/g, "")) - parseInt(b.salary.replace(/\D/g, "")));
    else if (sortBy === "applicants") result = [...result].sort((a, b) => b.applicants - a.applicants);

    return result;
  }, [allJobs, searchQuery, categoryFilter, typeFilter, experienceFilter, sortBy]);

  const toggleSave = (id: number) => setSavedJobIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const handleApply = (job: JobItem) => {
    setSelectedJob(job);
    setShowApplyModal(true);
  };

  const handleViewDetails = (job: JobItem) => {
    setSelectedJob(job);
    setShowDetailsModal(true);
  };

  const handlePostJob = (posted: PostedJob) => {
    const newJob: JobItem = {
      id: posted.id,
      title: posted.title,
      company: "You",
      logo: "https://api.dicebear.com/7.x/initials/svg?seed=ME",
      location: posted.location,
      type: posted.type,
      salary: posted.salaryMin && posted.salaryMax ? `$${posted.salaryMin} - $${posted.salaryMax}` : "Negotiable",
      posted: "Just now",
      description: posted.description.slice(0, 100) + "...",
      fullDescription: posted.description,
      tags: posted.skills,
      saved: false,
      requirements: [],
      benefits: [],
      employerInfo: "Posted by you",
      applicants: 0,
      experienceLevel: posted.experienceLevel,
      category: posted.category,
    };
    setMyPostedJobs(prev => [newJob, ...prev]);
  };

  const savedJobs = allJobs.filter(j => savedJobIds.includes(j.id));
  const appliedJobs = allJobs.filter(j => myApplications.includes(j.id));

  const renderJobGrid = (jobs: JobItem[], emptyMsg: string) => {
    if (jobs.length === 0) {
      return (
        <Card className="col-span-full">
          <CardContent className="py-12 text-center text-muted-foreground text-sm">
            {emptyMsg}
          </CardContent>
        </Card>
      );
    }
    return jobs.map((job, i) => (
      <JobCard
        key={job.id}
        job={job}
        index={i}
        isSaved={savedJobIds.includes(job.id)}
        onToggleSave={toggleSave}
        onApply={handleApply}
        onViewDetails={handleViewDetails}
      />
    ));
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <TopBar />

      <main className="flex-1 pb-16 md:pb-8 pt-14 md:pt-14">
        <div className="w-full max-w-[100vw] sm:max-w-md md:max-w-4xl lg:max-w-[680px] mx-auto px-1.5 sm:px-4 md:px-6 lg:px-0 pt-2 sm:pt-4 md:pt-6 overflow-hidden">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 sm:mb-5 flex items-center justify-between gap-3"
          >
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-0.5">
                Job Board
              </h1>
              <p className="text-sm text-muted-foreground">Find your next opportunity or post a job</p>
            </div>
            <Button
              className="gap-1.5 bg-gradient-to-r from-primary to-primary/80 text-xs sm:text-sm h-9 sm:h-10 flex-shrink-0"
              onClick={() => setShowPostModal(true)}
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Post a Job</span>
              <span className="sm:hidden">Post</span>
            </Button>
          </motion.div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="w-full sm:w-auto grid grid-cols-4 sm:flex gap-1 h-auto p-1">
              <TabsTrigger value="all" className="text-xs sm:text-sm gap-1 py-1.5">
                <Briefcase className="w-3.5 h-3.5 hidden sm:block" />All Jobs
              </TabsTrigger>
              <TabsTrigger value="posted" className="text-xs sm:text-sm gap-1 py-1.5">
                <FileText className="w-3.5 h-3.5 hidden sm:block" />My Posts
                {myPostedJobs.length > 0 && <Badge variant="secondary" className="ml-1 text-[10px] px-1 py-0">{myPostedJobs.length}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="applied" className="text-xs sm:text-sm gap-1 py-1.5">
                <Send className="w-3.5 h-3.5 hidden sm:block" />Applied
                {myApplications.length > 0 && <Badge variant="secondary" className="ml-1 text-[10px] px-1 py-0">{myApplications.length}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="saved" className="text-xs sm:text-sm gap-1 py-1.5">
                <Heart className="w-3.5 h-3.5 hidden sm:block" />Saved
                {savedJobs.length > 0 && <Badge variant="secondary" className="ml-1 text-[10px] px-1 py-0">{savedJobs.length}</Badge>}
              </TabsTrigger>
            </TabsList>

            {/* All Jobs Tab */}
            <TabsContent value="all" className="space-y-4 mt-0">
              <JobFilters
                searchQuery={searchQuery} onSearchChange={setSearchQuery}
                categoryFilter={categoryFilter} onCategoryChange={setCategoryFilter}
                typeFilter={typeFilter} onTypeChange={setTypeFilter}
                experienceFilter={experienceFilter} onExperienceChange={setExperienceFilter}
                sortBy={sortBy} onSortChange={setSortBy}
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                {renderJobGrid(filteredJobs, "No jobs found matching your criteria")}
              </div>
            </TabsContent>

            {/* My Posted Jobs */}
            <TabsContent value="posted" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                {renderJobGrid(myPostedJobs, "You haven't posted any jobs yet. Click \"Post a Job\" to get started!")}
              </div>
            </TabsContent>

            {/* Applied Jobs */}
            <TabsContent value="applied" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                {renderJobGrid(appliedJobs, "You haven't applied to any jobs yet. Browse the job board to find opportunities!")}
              </div>
            </TabsContent>

            {/* Saved Jobs */}
            <TabsContent value="saved" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                {renderJobGrid(savedJobs, "No saved jobs. Bookmark jobs you're interested in!")}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <MobileNav />

      <PostJobModal open={showPostModal} onOpenChange={setShowPostModal} onPost={handlePostJob} />
      <JobDetailsModal job={selectedJob} open={showDetailsModal} onOpenChange={setShowDetailsModal} onApply={handleApply} />
      <ApplyJobModal job={selectedJob} open={showApplyModal} onOpenChange={setShowApplyModal} />
    </div>
  );
}
