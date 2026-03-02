import { motion } from "framer-motion";
import { Search, X, Users, CalendarDays, ShoppingBag, Layers } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import TopBar from "@/components/TopBar";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";

const trendingTopics = [
  { id: 1, tag: "#Technology", posts: "45.2K posts" },
  { id: 2, tag: "#Design", posts: "32.1K posts" },
  { id: 3, tag: "#Startup", posts: "28.5K posts" },
  { id: 4, tag: "#AI", posts: "56.8K posts" },
];

const mockPeople = [
  { id: 1, name: "Sarah Connor", username: "@sarahconnor", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah", bio: "Tech enthusiast & designer", mutualFriends: 12 },
  { id: 2, name: "John Smith", username: "@johnsmith", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John", bio: "Full-stack developer", mutualFriends: 5 },
  { id: 3, name: "Emma Watson", username: "@emmawatson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma", bio: "UX Researcher | Coffee lover", mutualFriends: 8 },
];

const mockGroups = [
  { id: 1, name: "React Developers", members: "15.2K", image: "https://api.dicebear.com/7.x/shapes/svg?seed=react", category: "Technology" },
  { id: 2, name: "UI/UX Design Hub", members: "8.4K", image: "https://api.dicebear.com/7.x/shapes/svg?seed=design", category: "Design" },
  { id: 3, name: "Startup Founders", members: "22.1K", image: "https://api.dicebear.com/7.x/shapes/svg?seed=startup", category: "Business" },
];

const mockEvents = [
  { id: 1, title: "Tech Conference 2026", date: "Mar 15, 2026", location: "San Francisco, CA", attendees: 342 },
  { id: 2, title: "Design Meetup", date: "Mar 20, 2026", location: "New York, NY", attendees: 89 },
  { id: 3, title: "Startup Pitch Night", date: "Apr 2, 2026", location: "Austin, TX", attendees: 156 },
];

const mockMarketplace = [
  { id: 1, title: "MacBook Pro 2025", price: "$1,200", image: "https://api.dicebear.com/7.x/shapes/svg?seed=macbook", location: "Los Angeles, CA" },
  { id: 2, title: "Standing Desk", price: "$350", image: "https://api.dicebear.com/7.x/shapes/svg?seed=desk", location: "Chicago, IL" },
  { id: 3, title: "Mechanical Keyboard", price: "$85", image: "https://api.dicebear.com/7.x/shapes/svg?seed=keyboard", location: "Seattle, WA" },
];

const Explore = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const isSearching = searchQuery.trim().length > 0;

  const filteredPeople = useMemo(() =>
    mockPeople.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.username.toLowerCase().includes(searchQuery.toLowerCase())),
    [searchQuery]
  );
  const filteredGroups = useMemo(() =>
    mockGroups.filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [searchQuery]
  );
  const filteredEvents = useMemo(() =>
    mockEvents.filter(e => e.title.toLowerCase().includes(searchQuery.toLowerCase())),
    [searchQuery]
  );
  const filteredMarketplace = useMemo(() =>
    mockMarketplace.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase())),
    [searchQuery]
  );

  const hasResults = filteredPeople.length > 0 || filteredGroups.length > 0 || filteredEvents.length > 0 || filteredMarketplace.length > 0;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <TopBar />

      <main className="flex-1 md:ml-64 pb-16 md:pb-8 pt-14 md:pt-14 fixed md:relative inset-0 md:inset-auto z-50 md:z-auto bg-background">
        <div className="w-full max-w-3xl lg:max-w-4xl mx-auto lg:mx-0 lg:ml-8 px-2 sm:px-4 md:px-6 pt-4 md:pt-6 h-full overflow-y-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Explore</h1>
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="md:hidden h-9 w-9">
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search people, groups, events, marketplace..."
                className="pl-10 h-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" onClick={() => setSearchQuery("")}>
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </motion.div>

          {isSearching ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full grid grid-cols-5 h-10 mb-4">
                  <TabsTrigger value="all" className="text-xs sm:text-sm">All</TabsTrigger>
                  <TabsTrigger value="people" className="text-xs sm:text-sm">People</TabsTrigger>
                  <TabsTrigger value="groups" className="text-xs sm:text-sm">Groups</TabsTrigger>
                  <TabsTrigger value="events" className="text-xs sm:text-sm">Events</TabsTrigger>
                  <TabsTrigger value="market" className="text-xs sm:text-sm">Market</TabsTrigger>
                </TabsList>

                {!hasResults && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Search className="w-12 h-12 mx-auto mb-3 opacity-40" />
                    <p className="text-lg font-medium">No results found</p>
                    <p className="text-sm">Try a different search term</p>
                  </div>
                )}

                {/* All Tab */}
                <TabsContent value="all" className="space-y-4">
                  {filteredPeople.length > 0 && (
                    <SearchSection title="People" icon={<Users className="w-4 h-4" />}>
                      {filteredPeople.map(person => <PersonCard key={person.id} person={person} />)}
                    </SearchSection>
                  )}
                  {filteredGroups.length > 0 && (
                    <SearchSection title="Groups" icon={<Layers className="w-4 h-4" />}>
                      {filteredGroups.map(group => <GroupCard key={group.id} group={group} />)}
                    </SearchSection>
                  )}
                  {filteredEvents.length > 0 && (
                    <SearchSection title="Events" icon={<CalendarDays className="w-4 h-4" />}>
                      {filteredEvents.map(event => <EventCard key={event.id} event={event} />)}
                    </SearchSection>
                  )}
                  {filteredMarketplace.length > 0 && (
                    <SearchSection title="Marketplace" icon={<ShoppingBag className="w-4 h-4" />}>
                      {filteredMarketplace.map(item => <MarketCard key={item.id} item={item} />)}
                    </SearchSection>
                  )}
                </TabsContent>

                {/* People Tab */}
                <TabsContent value="people" className="space-y-2">
                  {filteredPeople.length > 0 ? filteredPeople.map(person => <PersonCard key={person.id} person={person} />) : <NoResults />}
                </TabsContent>

                {/* Groups Tab */}
                <TabsContent value="groups" className="space-y-2">
                  {filteredGroups.length > 0 ? filteredGroups.map(group => <GroupCard key={group.id} group={group} />) : <NoResults />}
                </TabsContent>

                {/* Events Tab */}
                <TabsContent value="events" className="space-y-2">
                  {filteredEvents.length > 0 ? filteredEvents.map(event => <EventCard key={event.id} event={event} />) : <NoResults />}
                </TabsContent>

                {/* Marketplace Tab */}
                <TabsContent value="market" className="space-y-2">
                  {filteredMarketplace.length > 0 ? filteredMarketplace.map(item => <MarketCard key={item.id} item={item} />) : <NoResults />}
                </TabsContent>
              </Tabs>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="text-xl font-bold text-foreground mb-4">Trending Topics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {trendingTopics.map((topic, index) => (
                  <motion.div key={topic.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1 }} whileHover={{ scale: 1.02 }}>
                    <Card className="p-5 hover-lift cursor-pointer">
                      <h3 className="text-lg font-bold gradient-text mb-1">{topic.tag}</h3>
                      <p className="text-sm text-muted-foreground">{topic.posts}</p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

const SearchSection = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
  <div>
    <div className="flex items-center gap-2 mb-2">
      {icon}
      <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">{title}</h3>
    </div>
    <div className="space-y-2">{children}</div>
  </div>
);

const PersonCard = ({ person }: { person: typeof mockPeople[0] }) => (
  <Card className="p-3 flex items-center gap-3">
    <Avatar className="w-12 h-12">
      <AvatarImage src={person.avatar} />
      <AvatarFallback>{person.name[0]}</AvatarFallback>
    </Avatar>
    <div className="flex-1 min-w-0">
      <p className="font-semibold text-sm text-foreground truncate">{person.name}</p>
      <p className="text-xs text-muted-foreground">{person.username}</p>
      <p className="text-xs text-muted-foreground">{person.mutualFriends} mutual friends</p>
    </div>
    <Button size="sm" variant="outline" className="shrink-0">Add</Button>
  </Card>
);

const GroupCard = ({ group }: { group: typeof mockGroups[0] }) => (
  <Card className="p-3 flex items-center gap-3">
    <Avatar className="w-12 h-12 rounded-lg">
      <AvatarImage src={group.image} />
      <AvatarFallback className="rounded-lg">{group.name[0]}</AvatarFallback>
    </Avatar>
    <div className="flex-1 min-w-0">
      <p className="font-semibold text-sm text-foreground truncate">{group.name}</p>
      <p className="text-xs text-muted-foreground">{group.members} members</p>
      <Badge variant="secondary" className="text-[10px] mt-1">{group.category}</Badge>
    </div>
    <Button size="sm" variant="outline" className="shrink-0">Join</Button>
  </Card>
);

const EventCard = ({ event }: { event: typeof mockEvents[0] }) => (
  <Card className="p-3 flex items-center gap-3">
    <div className="w-12 h-12 rounded-lg bg-primary/10 flex flex-col items-center justify-center shrink-0">
      <CalendarDays className="w-5 h-5 text-primary" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-semibold text-sm text-foreground truncate">{event.title}</p>
      <p className="text-xs text-muted-foreground">{event.date} · {event.location}</p>
      <p className="text-xs text-muted-foreground">{event.attendees} attending</p>
    </div>
    <Button size="sm" variant="outline" className="shrink-0">Interested</Button>
  </Card>
);

const MarketCard = ({ item }: { item: typeof mockMarketplace[0] }) => (
  <Card className="p-3 flex items-center gap-3">
    <Avatar className="w-12 h-12 rounded-lg">
      <AvatarImage src={item.image} />
      <AvatarFallback className="rounded-lg">{item.title[0]}</AvatarFallback>
    </Avatar>
    <div className="flex-1 min-w-0">
      <p className="font-semibold text-sm text-foreground truncate">{item.title}</p>
      <p className="text-sm font-bold text-primary">{item.price}</p>
      <p className="text-xs text-muted-foreground">{item.location}</p>
    </div>
  </Card>
);

const NoResults = () => (
  <div className="text-center py-8 text-muted-foreground">
    <p className="text-sm">No results in this category</p>
  </div>
);

export default Explore;
