import { motion } from "framer-motion";
import { Search, X, Users, CalendarDays, ShoppingBag, Layers, TrendingUp, Flame, Sparkles } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import TopBar from "@/components/TopBar";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import TrendingSection from "@/components/TrendingSection";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { useFeed, useTrendingTopics } from "@/hooks/use-feed";
import LivePost from "@/components/LivePost";

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

const CATEGORIES = [
  { name: "Technology", emoji: "💻" },
  { name: "Design", emoji: "🎨" },
  { name: "AI", emoji: "🤖" },
  { name: "Startup", emoji: "🚀" },
  { name: "Business", emoji: "💼" },
  { name: "Science", emoji: "🔬" },
  { name: "Art", emoji: "🖼️" },
  { name: "Sports", emoji: "⚽" },
  { name: "Music", emoji: "🎵" },
  { name: "Travel", emoji: "✈️" },
];

const Explore = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const isSearching = searchQuery.trim().length > 0;

  const { posts: trendingPosts, isLoading: loadingTrending } = useFeed({ feedType: "trending", limit: 6 });
  const { data: topics } = useTrendingTopics();

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
  const hasResults = filteredPeople.length > 0 || filteredGroups.length > 0 || filteredEvents.length > 0;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <TopBar />

      <main className="flex-1 md:ml-64 lg:ml-72 xl:ml-80 pb-16 md:pb-8 pt-1 md:pt-14 fixed md:relative inset-0 md:inset-auto z-50 md:z-auto bg-background">
        <div className="w-full max-w-3xl lg:max-w-full mx-auto lg:mx-0 px-2 sm:px-4 md:px-6 lg:px-10 pt-0 md:pt-6 h-full overflow-y-auto">
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
                placeholder="Search people, groups, topics..."
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
                <TabsList className="w-full grid grid-cols-4 h-10 mb-4">
                  <TabsTrigger value="all" className="text-xs sm:text-sm">All</TabsTrigger>
                  <TabsTrigger value="people" className="text-xs sm:text-sm">People</TabsTrigger>
                  <TabsTrigger value="groups" className="text-xs sm:text-sm">Groups</TabsTrigger>
                  <TabsTrigger value="events" className="text-xs sm:text-sm">Events</TabsTrigger>
                </TabsList>

                {!hasResults && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Search className="w-12 h-12 mx-auto mb-3 opacity-40" />
                    <p className="text-lg font-medium">No results found</p>
                    <p className="text-sm">Try a different search term</p>
                  </div>
                )}

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
                </TabsContent>
                <TabsContent value="people" className="space-y-2">
                  {filteredPeople.length > 0 ? filteredPeople.map(person => <PersonCard key={person.id} person={person} />) : <NoResults />}
                </TabsContent>
                <TabsContent value="groups" className="space-y-2">
                  {filteredGroups.length > 0 ? filteredGroups.map(group => <GroupCard key={group.id} group={group} />) : <NoResults />}
                </TabsContent>
                <TabsContent value="events" className="space-y-2">
                  {filteredEvents.length > 0 ? filteredEvents.map(event => <EventCard key={event.id} event={event} />) : <NoResults />}
                </TabsContent>
              </Tabs>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-6">
              {/* Category Chips */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-bold text-foreground">Categories</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <motion.button
                      key={cat.name}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                        selectedCategory === cat.name
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-muted/70 hover:bg-muted text-foreground border-border"
                      }`}
                    >
                      <span>{cat.emoji}</span>
                      <span>{cat.name}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Trending Topics */}
              <TrendingSection variant="full" />

              {/* Trending Posts */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Flame className="w-5 h-5 text-orange-500" />
                  <h2 className="text-lg font-bold text-foreground">Trending Posts</h2>
                </div>
                {loadingTrending ? (
                  <div className="space-y-3">
                    {[1, 2].map(i => (
                      <Card key={i} className="p-4 space-y-3">
                        <div className="flex items-center gap-2">
                          <Skeleton className="w-9 h-9 rounded-full" />
                          <div className="space-y-1">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-16" />
                          </div>
                        </div>
                        <Skeleton className="h-4 w-full" />
                      </Card>
                    ))}
                  </div>
                ) : trendingPosts.length === 0 ? (
                  <Card className="p-6 text-center text-muted-foreground">
                    <TrendingUp className="w-10 h-10 mx-auto mb-2 opacity-40" />
                    <p className="text-sm">No trending posts yet. Be the first to create one!</p>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {trendingPosts.map((post, index) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.08 }}
                      >
                        <LivePost {...post} is_trending />
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* People suggestions */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-bold text-foreground">Suggested Creators</h2>
                </div>
                <div className="space-y-2">
                  {mockPeople.map(person => <PersonCard key={person.id} person={person} />)}
                </div>
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
    <Button size="sm" variant="outline" className="shrink-0">Follow</Button>
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

const NoResults = () => (
  <div className="text-center py-8 text-muted-foreground">
    <p className="text-sm">No results in this category</p>
  </div>
);

export default Explore;
