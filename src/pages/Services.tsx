import { Handshake, Search, Filter, MapPin, Star, Clock, MessageCircle, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import TopBar from "@/components/TopBar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const services = [
  {
    id: 1,
    title: "Home Cleaning",
    description: "Professional home cleaning services. Deep cleaning, regular maintenance, and move-out cleaning available.",
    provider: "Maria Garcia",
    providerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
    location: "San Francisco, CA",
    category: "Home Services",
    price: "$50/hr",
    rating: 4.9,
    reviews: 128,
    responseTime: "Usually responds within 1 hour",
  },
  {
    id: 2,
    title: "Web Development",
    description: "Full-stack web development services. React, Node.js, and modern web technologies. Portfolio available.",
    provider: "Alex Chen",
    providerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    location: "Remote",
    category: "Technology",
    price: "$75/hr",
    rating: 4.8,
    reviews: 89,
    responseTime: "Usually responds within 2 hours",
  },
  {
    id: 3,
    title: "Personal Training",
    description: "Certified personal trainer offering customized workout plans and nutrition guidance. Online and in-person.",
    provider: "Mike Johnson",
    providerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    location: "Los Angeles, CA",
    category: "Fitness",
    price: "$60/hr",
    rating: 4.7,
    reviews: 156,
    responseTime: "Usually responds within 30 mins",
  },
  {
    id: 4,
    title: "Photography",
    description: "Professional photography for events, portraits, and commercial projects. High-quality equipment and editing.",
    provider: "Sarah Williams",
    providerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SarahW",
    location: "New York, NY",
    category: "Creative",
    price: "$100/hr",
    rating: 4.9,
    reviews: 203,
    responseTime: "Usually responds within 3 hours",
  },
  {
    id: 5,
    title: "Tutoring - Math & Science",
    description: "Experienced tutor for K-12 and college level math and science. SAT/ACT prep also available.",
    provider: "David Park",
    providerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    location: "Boston, MA",
    category: "Education",
    price: "$45/hr",
    rating: 4.8,
    reviews: 92,
    responseTime: "Usually responds within 1 hour",
  },
];

const categories = [
  "All Categories",
  "Home Services",
  "Technology",
  "Fitness",
  "Creative",
  "Education",
  "Beauty",
  "Automotive",
  "Legal",
  "Financial",
];

export default function Services() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [showPostDialog, setShowPostDialog] = useState(false);
  const [newService, setNewService] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    location: "",
  });

  const handlePostService = () => {
    if (newService.title && newService.description && newService.category) {
      toast({ title: "Service posted successfully!" });
      setShowPostDialog(false);
      setNewService({ title: "", description: "", category: "", price: "", location: "" });
    }
  };

  const handleContact = (providerName: string) => {
    toast({ title: `Message sent to ${providerName}` });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <TopBar />

      <main className="flex-1 md:ml-64 pb-16 md:pb-8 pt-14 md:pt-0">
        <div className="max-w-4xl mx-auto px-4 md:px-6 pt-2 sm:pt-4 md:pt-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 sm:mb-5 md:mb-6"
          >
            <div className="flex items-center gap-3 mb-1 sm:mb-2">
              <Handshake className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Services
              </h1>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground">Find and offer services in your community</p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6 space-y-3"
          >
            {/* Search Bar and Post Button */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 rounded-lg"
                />
              </div>
              <Button variant="outline" size="icon" className="h-12 w-12 flex-shrink-0 rounded-lg">
                <Filter className="w-5 h-5" />
              </Button>
              <Dialog open={showPostDialog} onOpenChange={setShowPostDialog}>
                <DialogTrigger asChild>
                  <Button className="h-12 px-4 md:px-6 flex-shrink-0 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 rounded-lg font-semibold">
                    <Plus className="w-5 h-5 md:mr-2" />
                    <span className="hidden md:inline">Post Service</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Post Your Service</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="title">Service Title</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Home Cleaning"
                        value={newService.title}
                        onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={newService.category}
                        onValueChange={(value) => setNewService({ ...newService, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.slice(1).map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="price">Price</Label>
                      <Input
                        id="price"
                        placeholder="e.g., $50/hr"
                        value={newService.price}
                        onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        placeholder="e.g., San Francisco, CA or Remote"
                        value={newService.location}
                        onChange={(e) => setNewService({ ...newService, location: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your service..."
                        value={newService.description}
                        onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                        rows={4}
                      />
                    </div>
                    <Button className="w-full" onClick={handlePostService}>
                      Post Service
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Category Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  size="sm"
                  className="flex-shrink-0 rounded-full"
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat === "All Categories" ? "All" : cat}
                </Button>
              ))}
            </div>

            {/* Additional Filters */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <MapPin className="w-3 h-3" />
                Location
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                Price Range
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Star className="w-3 h-3" />
                Rating
              </Button>
            </div>
          </motion.div>

          {/* Services List */}
          <div className="space-y-4">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-all">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      {/* Provider Avatar */}
                      <Avatar className="w-12 h-12 flex-shrink-0">
                        <AvatarImage src={service.providerAvatar} />
                        <AvatarFallback>{service.provider[0]}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="secondary" className="text-[10px] sm:text-xs">
                                {service.category}
                              </Badge>
                              <div className="flex items-center gap-1 text-yellow-500">
                                <Star className="w-3 h-3 fill-current" />
                                <span className="text-xs font-medium">{service.rating}</span>
                                <span className="text-xs text-muted-foreground">({service.reviews})</span>
                              </div>
                            </div>
                            <h3 className="font-semibold text-sm sm:text-base text-foreground">
                              {service.title}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              by {service.provider}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-bold text-primary text-sm sm:text-base">{service.price}</p>
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mt-2">
                          {service.description}
                        </p>

                        <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground flex-wrap">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{service.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{service.responseTime}</span>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-3">
                          <Button
                            size="sm"
                            className="flex-1 sm:flex-none"
                            onClick={() => handleContact(service.provider)}
                          >
                            <MessageCircle className="w-3 h-3 mr-1" />
                            Contact
                          </Button>
                          <Button variant="outline" size="sm">
                            View Profile
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Load More */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center pb-6"
          >
            <Button variant="outline" className="w-full sm:w-auto">
              <Handshake className="w-4 h-4 mr-2" />
              Load More Services
            </Button>
          </motion.div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
}