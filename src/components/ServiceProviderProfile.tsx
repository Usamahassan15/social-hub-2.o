import { useState } from "react";
import { Star, MapPin, Clock, MessageCircle, Award, X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Service {
  id: number;
  title: string;
  description: string;
  provider: string;
  providerAvatar: string;
  location: string;
  category: string;
  price: string;
  rating: number;
  reviews: number;
  responseTime: string;
  image: string;
}

interface ServiceProviderProfileProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
  onContact: (providerName: string) => void;
}

const tabs = ["about", "services", "portfolio", "reviews"] as const;
type TabType = typeof tabs[number];

const portfolioImages = [
  "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=300&h=300&fit=crop",
];

const mockReviews = [
  { id: 1, user: "John D.", avatar: "John", rating: 5, text: "Excellent service! Very professional and thorough.", date: "2 weeks ago" },
  { id: 2, user: "Sarah M.", avatar: "Sarah", rating: 5, text: "Amazing work, highly recommend to everyone!", date: "1 month ago" },
  { id: 3, user: "Mike R.", avatar: "Mike", rating: 4, text: "Great communication and quality work.", date: "1 month ago" },
  { id: 4, user: "Emma L.", avatar: "Emma", rating: 5, text: "Exceeded my expectations. Will hire again!", date: "2 months ago" },
];

const mockServices = [
  { id: 1, title: "Standard Cleaning", price: "$50/session", duration: "2-3 hours" },
  { id: 2, title: "Deep Cleaning", price: "$120/session", duration: "4-5 hours" },
  { id: 3, title: "Move-out Cleaning", price: "$200/session", duration: "5-6 hours" },
];

export default function ServiceProviderProfile({
  service,
  isOpen,
  onClose,
  onContact,
}: ServiceProviderProfileProps) {
  const [activeTab, setActiveTab] = useState<TabType>("about");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  if (!service) return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    const currentIndex = tabs.indexOf(activeTab);

    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIndex < tabs.length - 1) {
        setActiveTab(tabs[currentIndex + 1]);
      } else if (diff < 0 && currentIndex > 0) {
        setActiveTab(tabs[currentIndex - 1]);
      }
    }
    setTouchStart(null);
  };

  const navigateTab = (direction: 'prev' | 'next') => {
    const currentIndex = tabs.indexOf(activeTab);
    if (direction === 'next' && currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    } else if (direction === 'prev' && currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl w-full h-[100dvh] sm:h-[95dvh] md:h-auto md:max-h-[90vh] p-0 overflow-hidden rounded-none sm:rounded-lg">
          <div className="flex flex-col h-full max-h-full">
            {/* Header */}
            <div className="relative p-4 sm:p-6 border-b border-border bg-gradient-to-b from-primary/10 to-background flex-shrink-0">
              {/* Close button handled by DialogContent */}
              
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border-4 border-background shadow-lg">
                  <AvatarImage src={service.providerAvatar} />
                  <AvatarFallback>{service.provider[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="font-bold text-xl sm:text-2xl text-foreground">{service.provider}</h2>
                  <Badge variant="secondary" className="mt-1 mb-2">{service.category}</Badge>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="font-medium">{service.rating}</span>
                      <span>({service.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{service.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-2 mt-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{service.responseTime}</span>
                  </div>
                </div>
                <Button
                  className="bg-gradient-to-r from-primary to-primary/80 w-full sm:w-auto"
                  onClick={() => onContact(service.provider)}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabType)} className="flex-1 flex flex-col overflow-hidden min-h-0">
              <div className="border-b border-border px-2 sm:px-4 flex-shrink-0">
                <TabsList className="w-full grid grid-cols-4 h-12">
                  <TabsTrigger value="about" className="text-xs sm:text-sm">About Me</TabsTrigger>
                  <TabsTrigger value="services" className="text-xs sm:text-sm">Services</TabsTrigger>
                  <TabsTrigger value="portfolio" className="text-xs sm:text-sm">Portfolio</TabsTrigger>
                  <TabsTrigger value="reviews" className="text-xs sm:text-sm">Reviews</TabsTrigger>
                </TabsList>
              </div>

              <div
                className="flex-1 overflow-hidden min-h-0"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <ScrollArea className="h-full">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="p-4 sm:p-6"
                    >
                      <TabsContent value="about" className="mt-0 space-y-4">
                        <div>
                          <h3 className="font-semibold text-foreground mb-2">Bio</h3>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {service.description} With over 5 years of experience in the industry, I pride myself on delivering exceptional quality and customer satisfaction. I'm passionate about what I do and always strive to exceed expectations.
                          </p>
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-2">Location</h3>
                          <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <MapPin className="w-4 h-4" />
                            <span>{service.location}</span>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-2">Skills</h3>
                          <div className="flex flex-wrap gap-2">
                            {["Professional", "Reliable", "Quality Work", "Fast Response", "Experienced"].map((skill) => (
                              <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>
                            ))}
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="services" className="mt-0 space-y-3">
                        <h3 className="font-semibold text-foreground mb-3">Services Offered</h3>
                        {mockServices.map((svc) => (
                          <Card key={svc.id}>
                            <CardContent className="p-4 flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-foreground">{svc.title}</h4>
                                <p className="text-xs text-muted-foreground">{svc.duration}</p>
                              </div>
                              <p className="font-bold text-primary">{svc.price}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </TabsContent>

                      <TabsContent value="portfolio" className="mt-0">
                        <h3 className="font-semibold text-foreground mb-3">Work Samples</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                          {portfolioImages.map((img, index) => (
                            <motion.div
                              key={index}
                              whileHover={{ scale: 1.02 }}
                              className="aspect-square rounded-lg overflow-hidden cursor-pointer bg-muted"
                              onClick={() => setSelectedImage(img)}
                            >
                              <img src={img} alt={`Portfolio ${index + 1}`} className="w-full h-full object-cover" />
                            </motion.div>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="reviews" className="mt-0 space-y-4">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="text-center">
                            <p className="text-3xl font-bold text-foreground">{service.rating}</p>
                            <div className="flex items-center gap-1 justify-center">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < Math.floor(service.rating) ? 'text-yellow-500 fill-current' : 'text-muted'}`} />
                              ))}
                            </div>
                            <p className="text-xs text-muted-foreground">{service.reviews} reviews</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          {mockReviews.map((review) => (
                            <Card key={review.id}>
                              <CardContent className="p-3 sm:p-4">
                                <div className="flex items-start gap-3">
                                  <Avatar className="w-8 h-8">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${review.avatar}`} />
                                    <AvatarFallback>{review.user[0]}</AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <p className="font-medium text-sm text-foreground">{review.user}</p>
                                      <p className="text-xs text-muted-foreground">{review.date}</p>
                                    </div>
                                    <div className="flex gap-0.5 my-1">
                                      {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-yellow-500 fill-current' : 'text-muted'}`} />
                                      ))}
                                    </div>
                                    <p className="text-sm text-muted-foreground">{review.text}</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </TabsContent>
                    </motion.div>
                  </AnimatePresence>
                </ScrollArea>
              </div>

              {/* Mobile swipe indicators */}
              <div className="flex items-center justify-between p-2 border-t border-border md:hidden flex-shrink-0 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={activeTab === "about"}
                  onClick={() => navigateTab('prev')}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Prev
                </Button>
                <div className="flex gap-1">
                  {tabs.map((tab) => (
                    <div
                      key={tab}
                      className={`w-2 h-2 rounded-full ${activeTab === tab ? 'bg-primary' : 'bg-muted'}`}
                    />
                  ))}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={activeTab === "reviews"}
                  onClick={() => navigateTab('next')}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      {/* Portfolio Image Preview */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-2xl p-2">
          {selectedImage && (
            <img src={selectedImage} alt="Portfolio preview" className="w-full h-auto rounded-lg" />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}