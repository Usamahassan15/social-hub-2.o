import { Calendar, MapPin, Search, Filter, Star, Users, Clock, Share2, Bookmark, ToggleLeft, ToggleRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import TopBar from "@/components/TopBar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

const events = [
  {
    id: 1,
    title: "Tech Conference 2024",
    description: "Join us for the biggest tech conference of the year featuring industry leaders and innovative workshops.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop",
    date: "Dec 15, 2024",
    time: "9:00 AM - 6:00 PM",
    location: "San Francisco, CA",
    attendees: 1250,
    rating: 4.8,
    category: "Technology",
    price: "$99",
  },
  {
    id: 2,
    title: "Music Festival",
    description: "Three days of live music featuring top artists from around the world. Food, fun, and unforgettable memories.",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&h=400&fit=crop",
    date: "Dec 20-22, 2024",
    time: "2:00 PM - 11:00 PM",
    location: "Los Angeles, CA",
    attendees: 5000,
    rating: 4.9,
    category: "Music",
    price: "$150",
  },
  {
    id: 3,
    title: "Startup Networking",
    description: "Connect with fellow entrepreneurs, investors, and industry experts. Perfect for growing your network.",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&h=400&fit=crop",
    date: "Dec 18, 2024",
    time: "6:00 PM - 9:00 PM",
    location: "New York, NY",
    attendees: 300,
    rating: 4.6,
    category: "Business",
    price: "Free",
  },
  {
    id: 4,
    title: "Art Exhibition",
    description: "Explore contemporary art from emerging artists. Includes guided tours and artist meet-and-greets.",
    image: "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=600&h=400&fit=crop",
    date: "Dec 25, 2024",
    time: "10:00 AM - 8:00 PM",
    location: "Miami, FL",
    attendees: 800,
    rating: 4.7,
    category: "Art",
    price: "$25",
  },
  {
    id: 5,
    title: "Fitness Bootcamp",
    description: "Intensive weekend fitness bootcamp with certified trainers. All fitness levels welcome.",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=400&fit=crop",
    date: "Dec 28, 2024",
    time: "7:00 AM - 12:00 PM",
    location: "Denver, CO",
    attendees: 150,
    rating: 4.5,
    category: "Fitness",
    price: "$45",
  },
];

export default function Events() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLocalOnly, setIsLocalOnly] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<typeof events[0] | null>(null);
  const [savedEvents, setSavedEvents] = useState<number[]>([]);
  const [locationSearch, setLocationSearch] = useState("");
  const [showLocationInput, setShowLocationInput] = useState(false);

  const toggleSave = (eventId: number) => {
    setSavedEvents(prev =>
      prev.includes(eventId)
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
    toast({ title: savedEvents.includes(eventId) ? "Event removed" : "Event saved!" });
  };

  const handleJoin = (eventTitle: string) => {
    toast({ title: `Joined "${eventTitle}"!` });
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
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-1 sm:mb-2">
              Events
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">Discover events near you</p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6 space-y-3"
          >
            {/* Search Bar */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 rounded-lg"
                />
              </div>
              <Button variant="outline" size="icon" className="h-12 w-12 flex-shrink-0 rounded-lg">
                <Filter className="w-5 h-5" />
              </Button>
            </div>

            {/* Location Filter */}
            <div className="flex gap-2 items-center">
              <Button
                variant="outline"
                className="h-10 gap-2"
                onClick={() => setShowLocationInput(!showLocationInput)}
              >
                <MapPin className="w-4 h-4" />
                {locationSearch || "Select Location"}
              </Button>

              <Button
                variant={isLocalOnly ? "default" : "outline"}
                className="h-10 gap-2"
                onClick={() => setIsLocalOnly(!isLocalOnly)}
              >
                {isLocalOnly ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                Local Only
              </Button>
            </div>

            {/* Location Input */}
            {showLocationInput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter city or address..."
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                    className="pl-10 h-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Type to search locations (Google Maps integration ready)
                </p>
              </motion.div>
            )}

            {/* Category Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <Button variant="default" size="sm" className="flex-shrink-0 rounded-full">All</Button>
              <Button variant="outline" size="sm" className="flex-shrink-0 rounded-full">Technology</Button>
              <Button variant="outline" size="sm" className="flex-shrink-0 rounded-full">Music</Button>
              <Button variant="outline" size="sm" className="flex-shrink-0 rounded-full">Business</Button>
              <Button variant="outline" size="sm" className="flex-shrink-0 rounded-full">Art</Button>
              <Button variant="outline" size="sm" className="flex-shrink-0 rounded-full">Fitness</Button>
            </div>
          </motion.div>

          {/* Events List */}
          <div className="space-y-4">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
              >
                <Card
                  className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Event Image */}
                    <div className="w-full sm:w-40 md:w-48 h-32 sm:h-auto flex-shrink-0 overflow-hidden">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <CardContent className="flex-1 p-3 sm:p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary" className="text-[10px] sm:text-xs">
                              {event.category}
                            </Badge>
                            <div className="flex items-center gap-1 text-yellow-500">
                              <Star className="w-3 h-3 fill-current" />
                              <span className="text-xs font-medium">{event.rating}</span>
                            </div>
                          </div>
                          <h3 className="font-semibold text-sm sm:text-base text-foreground line-clamp-1">
                            {event.title}
                          </h3>
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                            {event.description}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-bold text-primary text-sm sm:text-base">{event.price}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground flex-wrap">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{event.attendees} attending</span>
                        </div>
                      </div>
                    </CardContent>
                  </div>
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
              <Calendar className="w-4 h-4 mr-2" />
              Load More Events
            </Button>
          </motion.div>
        </div>
      </main>

      {/* Event Details Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          {selectedEvent && (
            <>
              <div className="relative -mx-6 -mt-6 mb-4">
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3 flex gap-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-background/90"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSave(selectedEvent.id);
                    }}
                  >
                    <Bookmark className={`w-4 h-4 ${savedEvents.includes(selectedEvent.id) ? 'fill-primary text-primary' : ''}`} />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-background/90"
                    onClick={(e) => {
                      e.stopPropagation();
                      toast({ title: "Share link copied!" });
                    }}
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{selectedEvent.category}</Badge>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-medium">{selectedEvent.rating}</span>
                  </div>
                </div>
                <DialogTitle className="text-xl">{selectedEvent.title}</DialogTitle>
              </DialogHeader>

              <p className="text-sm text-muted-foreground">{selectedEvent.description}</p>

              <div className="space-y-3 mt-4">
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>{selectedEvent.date}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>{selectedEvent.time}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{selectedEvent.location}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Users className="w-4 h-4 text-primary" />
                  <span>{selectedEvent.attendees} people attending</span>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  className="flex-1"
                  onClick={() => {
                    handleJoin(selectedEvent.title);
                    setSelectedEvent(null);
                  }}
                >
                  Join Event - {selectedEvent.price}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => toggleSave(selectedEvent.id)}
                >
                  <Bookmark className={`w-4 h-4 mr-2 ${savedEvents.includes(selectedEvent.id) ? 'fill-primary text-primary' : ''}`} />
                  Save
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <MobileNav />
    </div>
  );
}