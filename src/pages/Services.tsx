import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Handshake, Search, Filter, MapPin, Star, Clock, MessageCircle, Plus, ImagePlus, FolderKanban } from "lucide-react";
import { motion } from "framer-motion";
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
import ServiceProjectsBidding from "@/components/ServiceProjectsBidding";
import ServiceProviderProfile from "@/components/ServiceProviderProfile";

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
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop",
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
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop",
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
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop",
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
    image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400&h=300&fit=crop",
  },
];

const categories = ["All Categories", "Home Services", "Technology", "Fitness", "Creative", "Education", "Beauty", "Automotive", "Legal", "Financial"];

export default function Services() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [showPostDialog, setShowPostDialog] = useState(false);
  const [showProjectsBidding, setShowProjectsBidding] = useState(false);
  const [serviceImages, setServiceImages] = useState<string[]>([]);
  const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newService, setNewService] = useState({ title: "", description: "", category: "", price: "", location: "" });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result && serviceImages.length < 3) {
            setServiceImages((prev) => [...prev, event.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handlePostService = () => {
    if (newService.title && newService.description && newService.category) {
      toast({ title: "Service posted successfully!" });
      setShowPostDialog(false);
      setNewService({ title: "", description: "", category: "", price: "", location: "" });
      setServiceImages([]);
    }
  };

  const handleContact = (providerName: string) => {
    setSelectedService(null);
    navigate("/messages");
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <TopBar />

      <main className="flex-1 md:ml-64 pb-16 md:pb-8 pt-14 md:pt-0">
        <div className="w-full max-w-full sm:max-w-lg md:max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto px-1 sm:px-4 md:px-6 pt-2 sm:pt-4 md:pt-6">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-4 sm:mb-5 md:mb-6 px-1 sm:px-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 mb-1 sm:mb-2">
                <Handshake className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Services</h1>
              </div>
              <Button variant="outline" className="gap-2" onClick={() => setShowProjectsBidding(true)}>
                <FolderKanban className="w-4 h-4" />
                <span className="hidden sm:inline">Projects</span>
              </Button>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground">Find and offer services in your community</p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-4 sm:mb-6 space-y-3 px-1 sm:px-0">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                <Input placeholder="Search services..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 sm:pl-10 h-10 sm:h-12 rounded-lg text-sm sm:text-base" />
              </div>
              <Button variant="outline" size="icon" className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 rounded-lg">
                <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              <Dialog open={showPostDialog} onOpenChange={setShowPostDialog}>
                <DialogTrigger asChild>
                  <Button className="h-10 sm:h-12 px-3 sm:px-4 md:px-6 flex-shrink-0 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 rounded-lg font-semibold">
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5 md:mr-2" />
                    <span className="hidden md:inline">Post Service</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                  <DialogHeader><DialogTitle>Post Your Service</DialogTitle></DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label className="mb-2 block">Add Images (up to 3)</Label>
                      <div className="flex gap-2">
                        {serviceImages.map((img, index) => (
                          <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted">
                            <img src={img} alt="" className="w-full h-full object-cover" />
                            <button onClick={() => setServiceImages((prev) => prev.filter((_, i) => i !== index))} className="absolute top-1 right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full text-xs">×</button>
                          </div>
                        ))}
                        {serviceImages.length < 3 && (
                          <button onClick={() => fileInputRef.current?.click()} className="w-20 h-20 rounded-lg border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 flex flex-col items-center justify-center gap-1 transition-colors">
                            <ImagePlus className="w-5 h-5 text-muted-foreground" />
                            <span className="text-[10px] text-muted-foreground">Add</span>
                          </button>
                        )}
                      </div>
                      <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                    </div>
                    <div><Label htmlFor="title">Service Title</Label><Input id="title" placeholder="e.g., Home Cleaning" value={newService.title} onChange={(e) => setNewService({ ...newService, title: e.target.value })} /></div>
                    <div><Label htmlFor="category">Category</Label><Select value={newService.category} onValueChange={(value) => setNewService({ ...newService, category: value })}><SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger><SelectContent>{categories.slice(1).map((cat) => (<SelectItem key={cat} value={cat}>{cat}</SelectItem>))}</SelectContent></Select></div>
                    <div><Label htmlFor="price">Price</Label><Input id="price" placeholder="e.g., $50/hr" value={newService.price} onChange={(e) => setNewService({ ...newService, price: e.target.value })} /></div>
                    <div><Label htmlFor="location">Location</Label><Input id="location" placeholder="e.g., San Francisco, CA or Remote" value={newService.location} onChange={(e) => setNewService({ ...newService, location: e.target.value })} /></div>
                    <div><Label htmlFor="description">Description</Label><Textarea id="description" placeholder="Describe your service..." value={newService.description} onChange={(e) => setNewService({ ...newService, description: e.target.value })} rows={4} /></div>
                    <Button className="w-full" onClick={handlePostService}>Post Service</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((cat) => (<Button key={cat} variant={selectedCategory === cat ? "default" : "outline"} size="sm" className="flex-shrink-0 rounded-full text-xs sm:text-sm" onClick={() => setSelectedCategory(cat)}>{cat === "All Categories" ? "All" : cat}</Button>))}
            </div>
          </motion.div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4 px-1 sm:px-0">
            {services.map((service, index) => (
              <motion.div key={service.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * index }}>
                <Card className="overflow-hidden hover:shadow-lg transition-all h-full">
                  <div className="aspect-video overflow-hidden bg-muted">
                    <img src={service.image} alt={service.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  </div>
                  <CardContent className="p-2 sm:p-3 md:p-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary" className="text-[10px] sm:text-xs">{service.category}</Badge>
                            <div className="flex items-center gap-1 text-yellow-500"><Star className="w-3 h-3 fill-current" /><span className="text-xs font-medium">{service.rating}</span></div>
                          </div>
                          <h3 className="font-semibold text-sm sm:text-base text-foreground line-clamp-1">{service.title}</h3>
                        </div>
                        <p className="font-bold text-primary text-sm sm:text-base flex-shrink-0">{service.price}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6"><AvatarImage src={service.providerAvatar} /><AvatarFallback>{service.provider[0]}</AvatarFallback></Avatar>
                        <span className="text-xs sm:text-sm text-muted-foreground">{service.provider}</span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{service.description}</p>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        <MapPin className="w-3 h-3" /><span>{service.location}</span>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <Button size="sm" className="flex-1 text-xs" onClick={() => handleContact(service.provider)}><MessageCircle className="w-3 h-3 mr-1" />Contact</Button>
                        <Button variant="outline" size="sm" className="text-xs" onClick={() => setSelectedService(service)}>View Profile</Button>
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
      <ServiceProjectsBidding isOpen={showProjectsBidding} onClose={() => setShowProjectsBidding(false)} />
      <ServiceProviderProfile service={selectedService} isOpen={!!selectedService} onClose={() => setSelectedService(null)} onContact={handleContact} />
    </div>
  );
}
