import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  Clock,
  DollarSign,
  User,
  Send,
  Star,
  Calendar,
  Briefcase,
  Award,
  Search,
  Filter,
  Layers,
  TrendingUp,
  FileText,
  MapPin,
  Globe,
  Timer,
  Wrench,
  Languages,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "@/hooks/use-toast";

const filterOptions = {
  category: ["Web Development", "Mobile Development", "Design", "Writing", "Marketing", "Data Science", "Video & Animation"],
  experienceLevel: ["Entry Level", "Intermediate", "Expert"],
  jobType: ["Hourly", "Fixed-Price"],
  projectLength: ["Less than 1 month", "1-3 months", "3-6 months", "More than 6 months"],
  hoursPerWeek: ["Less than 30 hrs/week", "More than 30 hrs/week"],
  clientHistory: ["No hires", "1-9 hires", "10+ hires"],
};

interface Project {
  id: number;
  title: string;
  description: string;
  budget: string;
  deadline: string;
  skills: string[];
  client: string;
  clientAvatar: string;
  postedDate: string;
  proposals: number;
  category: string;
}

interface Bid {
  id: number;
  freelancer: string;
  avatar: string;
  amount: string;
  deliveryTime: string;
  proposal: string;
  rating: number;
  completedJobs: number;
  score: number;
}

const mockProjects: Project[] = [
  {
    id: 1,
    title: "E-commerce Website Development",
    description: "Looking for an experienced developer to build a modern e-commerce platform with React and Node.js. Must include payment integration, inventory management, and admin dashboard.",
    budget: "$2,000 - $5,000",
    deadline: "30 days",
    skills: ["React", "Node.js", "MongoDB", "Stripe"],
    client: "Tech Solutions Inc.",
    clientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=TechSol",
    postedDate: "2 hours ago",
    proposals: 12,
    category: "Web Development",
  },
  {
    id: 2,
    title: "Mobile App UI/UX Design",
    description: "Need a talented designer to create UI/UX for a fitness tracking mobile app. Modern, clean, and user-friendly design required.",
    budget: "$800 - $1,500",
    deadline: "14 days",
    skills: ["Figma", "UI Design", "Mobile Design", "Prototyping"],
    client: "FitLife App",
    clientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=FitLife",
    postedDate: "5 hours ago",
    proposals: 8,
    category: "Design",
  },
  {
    id: 3,
    title: "Content Writing for Tech Blog",
    description: "Seeking experienced tech writers for ongoing blog content. Topics include AI, cloud computing, and software development.",
    budget: "$50 - $100/article",
    deadline: "Ongoing",
    skills: ["Content Writing", "SEO", "Tech Knowledge", "Research"],
    client: "Digital Trends Media",
    clientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=DTMedia",
    postedDate: "1 day ago",
    proposals: 25,
    category: "Writing",
  },
];

const mockBids: Bid[] = [
  {
    id: 1,
    freelancer: "Alex Developer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AlexDev",
    amount: "$3,500",
    deliveryTime: "25 days",
    proposal: "I have 5+ years of experience building e-commerce platforms. I can deliver a high-quality solution with all requested features.",
    rating: 4.9,
    completedJobs: 87,
    score: 42,
  },
  {
    id: 2,
    freelancer: "Sarah Coder",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SarahC",
    amount: "$4,200",
    deliveryTime: "28 days",
    proposal: "Expert in React and e-commerce solutions. Portfolio includes multiple successful projects similar to your requirements.",
    rating: 4.8,
    completedJobs: 65,
    score: 28,
  },
  {
    id: 3,
    freelancer: "Mike Builder",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=MikeB",
    amount: "$2,800",
    deliveryTime: "30 days",
    proposal: "Full-stack developer with Stripe integration expertise. I'll ensure your platform is secure and scalable.",
    rating: 4.7,
    completedJobs: 42,
    score: 15,
  },
];

interface ServiceProjectsBiddingProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ServiceProjectsBidding({ isOpen, onClose }: ServiceProjectsBiddingProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showBidForm, setShowBidForm] = useState(false);
  const [bids, setBids] = useState<Bid[]>(mockBids);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    experienceLevel: "",
    jobType: "",
    projectLength: "",
    hoursPerWeek: "",
    clientHistory: "",
    fixedPrice: false,
    clientLocation: "",
    clientTimezone: "",
    skills: "",
    languages: "",
  });
  const [bidForm, setBidForm] = useState({
    amount: "",
    deliveryTime: "",
    proposal: "",
  });

  const handleVote = (bidId: number, direction: "up" | "down") => {
    setBids((prev) =>
      prev
        .map((bid) =>
          bid.id === bidId
            ? { ...bid, score: bid.score + (direction === "up" ? 1 : -1) }
            : bid
        )
        .sort((a, b) => b.score - a.score)
    );
  };

  const handleSubmitBid = () => {
    if (!bidForm.amount || !bidForm.deliveryTime || !bidForm.proposal) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }
    toast({ title: "Bid submitted successfully!" });
    setShowBidForm(false);
    setBidForm({ amount: "", deliveryTime: "", proposal: "" });
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      experienceLevel: "",
      jobType: "",
      projectLength: "",
      hoursPerWeek: "",
      clientHistory: "",
      fixedPrice: false,
      clientLocation: "",
      clientTimezone: "",
      skills: "",
      languages: "",
    });
  };

  const filteredProjects = mockProjects.filter(project => {
    if (searchQuery && !project.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !project.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filters.category && project.category !== filters.category) return false;
    return true;
  });

  const FiltersContent = () => (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Filters</h3>
        <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs text-primary">
          Clear all
        </Button>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <Layers className="w-4 h-4 text-muted-foreground" />
          Category
        </Label>
        <Select value={filters.category} onValueChange={(v) => setFilters({...filters, category: v})}>
          <SelectTrigger className="w-full"><SelectValue placeholder="All categories" /></SelectTrigger>
          <SelectContent>
            {filterOptions.category.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Experience Level */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <TrendingUp className="w-4 h-4 text-muted-foreground" />
          Experience Level
        </Label>
        <Select value={filters.experienceLevel} onValueChange={(v) => setFilters({...filters, experienceLevel: v})}>
          <SelectTrigger className="w-full"><SelectValue placeholder="All levels" /></SelectTrigger>
          <SelectContent>
            {filterOptions.experienceLevel.map(lvl => <SelectItem key={lvl} value={lvl}>{lvl}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Job Type */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <Briefcase className="w-4 h-4 text-muted-foreground" />
          Job Type
        </Label>
        <Select value={filters.jobType} onValueChange={(v) => setFilters({...filters, jobType: v})}>
          <SelectTrigger className="w-full"><SelectValue placeholder="All types" /></SelectTrigger>
          <SelectContent>
            {filterOptions.jobType.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Fixed Price */}
      <div className="flex items-center gap-2">
        <Checkbox 
          id="fixedPrice" 
          checked={filters.fixedPrice} 
          onCheckedChange={(checked) => setFilters({...filters, fixedPrice: checked as boolean})} 
        />
        <Label htmlFor="fixedPrice" className="flex items-center gap-2 text-sm cursor-pointer">
          <DollarSign className="w-4 h-4 text-muted-foreground" />
          Fixed-Price Only
        </Label>
      </div>

      {/* Number of Proposals */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <FileText className="w-4 h-4 text-muted-foreground" />
          Number of Proposals
        </Label>
        <Select>
          <SelectTrigger className="w-full"><SelectValue placeholder="Any" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="0-5">Less than 5</SelectItem>
            <SelectItem value="5-10">5 to 10</SelectItem>
            <SelectItem value="10-15">10 to 15</SelectItem>
            <SelectItem value="15+">15+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Client Info */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <User className="w-4 h-4 text-muted-foreground" />
          Client History
        </Label>
        <Select value={filters.clientHistory} onValueChange={(v) => setFilters({...filters, clientHistory: v})}>
          <SelectTrigger className="w-full"><SelectValue placeholder="Any history" /></SelectTrigger>
          <SelectContent>
            {filterOptions.clientHistory.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Client Location */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          Client Location
        </Label>
        <Input 
          placeholder="Any location" 
          value={filters.clientLocation} 
          onChange={(e) => setFilters({...filters, clientLocation: e.target.value})} 
        />
      </div>

      {/* Client Timezone */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <Globe className="w-4 h-4 text-muted-foreground" />
          Client Time Zones
        </Label>
        <Input 
          placeholder="Any timezone" 
          value={filters.clientTimezone} 
          onChange={(e) => setFilters({...filters, clientTimezone: e.target.value})} 
        />
      </div>

      {/* Project Length */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <Timer className="w-4 h-4 text-muted-foreground" />
          Project Length
        </Label>
        <Select value={filters.projectLength} onValueChange={(v) => setFilters({...filters, projectLength: v})}>
          <SelectTrigger className="w-full"><SelectValue placeholder="Any duration" /></SelectTrigger>
          <SelectContent>
            {filterOptions.projectLength.map(len => <SelectItem key={len} value={len}>{len}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Skills */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <Wrench className="w-4 h-4 text-muted-foreground" />
          Skills
        </Label>
        <Input 
          placeholder="e.g. React, Python" 
          value={filters.skills} 
          onChange={(e) => setFilters({...filters, skills: e.target.value})} 
        />
      </div>

      {/* Hours per Week */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <Clock className="w-4 h-4 text-muted-foreground" />
          Hours per Week
        </Label>
        <Select value={filters.hoursPerWeek} onValueChange={(v) => setFilters({...filters, hoursPerWeek: v})}>
          <SelectTrigger className="w-full"><SelectValue placeholder="Any" /></SelectTrigger>
          <SelectContent>
            {filterOptions.hoursPerWeek.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Languages */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <Languages className="w-4 h-4 text-muted-foreground" />
          Languages
        </Label>
        <Input 
          placeholder="e.g. English, Spanish" 
          value={filters.languages} 
          onChange={(e) => setFilters({...filters, languages: e.target.value})} 
        />
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center gap-3 bg-card">
          <Button variant="ghost" size="icon" onClick={selectedProject ? () => setSelectedProject(null) : onClose}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg sm:text-xl font-bold flex-1">
            {selectedProject ? selectedProject.title : "Projects & Bidding"}
          </h1>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {!selectedProject ? (
              /* Projects List with Filters */
              <motion.div
                key="projects"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex"
              >
                {/* Desktop Filters Panel */}
                <aside className="hidden lg:block w-72 xl:w-80 border-r border-border bg-card/50 overflow-y-auto">
                  <ScrollArea className="h-full">
                    <div className="p-4">
                      <FiltersContent />
                    </div>
                  </ScrollArea>
                </aside>

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  {/* Search Bar */}
                  <div className="p-3 sm:p-4 border-b border-border bg-card/30">
                    <div className="flex gap-2 max-w-4xl mx-auto">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Search projects..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 h-10 sm:h-11"
                        />
                      </div>
                      {/* Mobile Filters Button */}
                      <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
                        <SheetTrigger asChild>
                          <Button variant="outline" size="icon" className="lg:hidden h-10 w-10 sm:h-11 sm:w-11 flex-shrink-0">
                            <Filter className="w-4 h-4" />
                          </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[85vw] sm:w-[380px] p-0">
                          <SheetHeader className="p-4 border-b border-border">
                            <SheetTitle>Filter Projects</SheetTitle>
                          </SheetHeader>
                          <ScrollArea className="h-[calc(100vh-60px)]">
                            <div className="p-4">
                              <FiltersContent />
                            </div>
                          </ScrollArea>
                        </SheetContent>
                      </Sheet>
                    </div>
                  </div>

                  {/* Projects List */}
                  <ScrollArea className="flex-1">
                    <div className="p-3 sm:p-4 space-y-3 sm:space-y-4 max-w-4xl mx-auto">
                      {filteredProjects.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                          <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>No projects found</p>
                        </div>
                      ) : (
                        filteredProjects.map((project, index) => (
                          <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <Card
                              className="cursor-pointer hover:shadow-lg transition-all"
                              onClick={() => setSelectedProject(project)}
                            >
                              <CardContent className="p-3 sm:p-4">
                                <div className="flex items-start gap-3">
                                  <Avatar className="w-10 h-10 flex-shrink-0">
                                    <AvatarImage src={project.clientAvatar} />
                                    <AvatarFallback>{project.client[0]}</AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                      <div>
                                        <Badge variant="secondary" className="text-xs mb-1">
                                          {project.category}
                                        </Badge>
                                        <h3 className="font-semibold text-foreground line-clamp-1">
                                          {project.title}
                                        </h3>
                                        <p className="text-xs text-muted-foreground">{project.client}</p>
                                      </div>
                                      <p className="font-bold text-primary text-sm flex-shrink-0">
                                        {project.budget}
                                      </p>
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                                      {project.description}
                                    </p>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                      {project.skills.slice(0, 3).map((skill) => (
                                        <Badge key={skill} variant="outline" className="text-xs">
                                          {skill}
                                        </Badge>
                                      ))}
                                      {project.skills.length > 3 && (
                                        <Badge variant="outline" className="text-xs">
                                          +{project.skills.length - 3}
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                                      <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {project.deadline}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <User className="w-3 h-3" />
                                        {project.proposals} proposals
                                      </span>
                                      <span>{project.postedDate}</span>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </motion.div>
            ) : (
              /* Project Detail View */
              <motion.div
                key="detail"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full overflow-y-auto"
              >
                <div className="max-w-4xl mx-auto">
                <Tabs defaultValue="details" className="w-full">
                  <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent sticky top-0 z-10 bg-background">
                    <TabsTrigger
                      value="details"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                    >
                      Details
                    </TabsTrigger>
                    <TabsTrigger
                      value="bids"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                    >
                      Bids ({bids.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="p-4 space-y-4">
                    {/* Client Info */}
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={selectedProject.clientAvatar} />
                            <AvatarFallback>{selectedProject.client[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{selectedProject.client}</p>
                            <p className="text-sm text-muted-foreground">Posted {selectedProject.postedDate}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Project Details */}
                    <Card>
                      <CardContent className="p-4 space-y-4">
                        <div>
                          <h3 className="font-semibold mb-2">Description</h3>
                          <p className="text-sm text-muted-foreground">{selectedProject.description}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-primary" />
                            <div>
                              <p className="text-xs text-muted-foreground">Budget</p>
                              <p className="font-semibold">{selectedProject.budget}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-primary" />
                            <div>
                              <p className="text-xs text-muted-foreground">Deadline</p>
                              <p className="font-semibold">{selectedProject.deadline}</p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-semibold mb-2">Required Skills</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedProject.skills.map((skill) => (
                              <Badge key={skill} variant="secondary">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Place Bid Button */}
                    <Button
                      className="w-full bg-gradient-to-r from-[hsl(199,100%,50%)] to-[hsl(207,90%,54%)] hover:opacity-90"
                      onClick={() => setShowBidForm(true)}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Place Bid
                    </Button>
                  </TabsContent>

                  <TabsContent value="bids" className="p-4 space-y-3">
                    {bids.map((bid) => (
                      <motion.div key={bid.id} layout>
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex gap-3">
                              {/* Vote Buttons */}
                              <div className="flex flex-col items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleVote(bid.id, "up")}
                                >
                                  <ChevronUp className="w-5 h-5" />
                                </Button>
                                <span className="font-bold text-sm">{bid.score}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleVote(bid.id, "down")}
                                >
                                  <ChevronDown className="w-5 h-5" />
                                </Button>
                              </div>

                              {/* Bid Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start gap-3">
                                  <Avatar className="w-10 h-10">
                                    <AvatarImage src={bid.avatar} />
                                    <AvatarFallback>{bid.freelancer[0]}</AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <h4 className="font-semibold">{bid.freelancer}</h4>
                                      <div className="flex items-center gap-1 text-yellow-500">
                                        <Star className="w-3 h-3 fill-current" />
                                        <span className="text-xs">{bid.rating}</span>
                                      </div>
                                      <Badge variant="outline" className="text-xs">
                                        <Briefcase className="w-3 h-3 mr-1" />
                                        {bid.completedJobs} jobs
                                      </Badge>
                                    </div>
                                    <div className="flex gap-4 mt-1 text-sm">
                                      <span className="font-bold text-primary">{bid.amount}</span>
                                      <span className="text-muted-foreground">in {bid.deliveryTime}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                      {bid.proposal}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </TabsContent>
                </Tabs>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bid Form Modal */}
      <Dialog open={showBidForm} onOpenChange={setShowBidForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Submit Your Proposal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="bidAmount">Bid Amount ($)</Label>
              <Input
                id="bidAmount"
                placeholder="Enter your bid amount"
                value={bidForm.amount}
                onChange={(e) => setBidForm({ ...bidForm, amount: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="deliveryTime">Delivery Time</Label>
              <Input
                id="deliveryTime"
                placeholder="e.g., 14 days"
                value={bidForm.deliveryTime}
                onChange={(e) => setBidForm({ ...bidForm, deliveryTime: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="proposal">Cover Letter / Proposal</Label>
              <Textarea
                id="proposal"
                placeholder="Describe why you're the best fit for this project..."
                rows={5}
                value={bidForm.proposal}
                onChange={(e) => setBidForm({ ...bidForm, proposal: e.target.value })}
              />
            </div>
            <Button
              className="w-full bg-gradient-to-r from-[hsl(199,100%,50%)] to-[hsl(207,90%,54%)] hover:opacity-90"
              onClick={handleSubmitBid}
            >
              Submit Proposal
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
