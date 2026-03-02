import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Plus, Search, Lock, Globe, UserPlus, UserMinus, Settings, Image as ImageIcon } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import TopBar from "@/components/TopBar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const groups = [
  {
    id: 1,
    name: "React Developers",
    cover: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=200&fit=crop",
    members: 12500,
    posts: 342,
    privacy: "public",
    description: "A community for React developers to share knowledge, tips, and best practices.",
    joined: true,
    admin: "John Doe",
  },
  {
    id: 2,
    name: "Startup Founders",
    cover: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=200&fit=crop",
    members: 8700,
    posts: 189,
    privacy: "public",
    description: "Connect with fellow startup founders and share your entrepreneurial journey.",
    joined: false,
    admin: "Sarah Smith",
  },
  {
    id: 3,
    name: "Photography Enthusiasts",
    cover: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400&h=200&fit=crop",
    members: 15300,
    posts: 567,
    privacy: "public",
    description: "Share your photos, get feedback, and learn from other photographers.",
    joined: true,
    admin: "Mike Johnson",
  },
  {
    id: 4,
    name: "Private Investors Club",
    cover: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop",
    members: 2100,
    posts: 89,
    privacy: "private",
    description: "Exclusive group for accredited investors to discuss investment opportunities.",
    joined: false,
    admin: "Emma Wilson",
  },
];

export default function Groups() {
  const [searchQuery, setSearchQuery] = useState("");
  const [joinedGroups, setJoinedGroups] = useState<number[]>(groups.filter(g => g.joined).map(g => g.id));
  const [selectedGroup, setSelectedGroup] = useState<typeof groups[0] | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: "", description: "", privacy: "public" });

  const toggleJoin = (groupId: number) => {
    setJoinedGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
    const group = groups.find(g => g.id === groupId);
    if (group) {
      toast({
        title: joinedGroups.includes(groupId) ? "Left group" : "Joined group",
        description: joinedGroups.includes(groupId) 
          ? `You left ${group.name}` 
          : `You joined ${group.name}`,
      });
    }
  };

  const handleCreateGroup = () => {
    if (newGroup.name && newGroup.description) {
      toast({ title: "Group created successfully!" });
      setShowCreateDialog(false);
      setNewGroup({ name: "", description: "", privacy: "public" });
    }
  };

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <TopBar />

      <main className="flex-1 md:ml-64 pb-16 md:pb-8 pt-14 md:pt-0">
        <div className="w-full max-w-4xl mx-auto lg:mx-0 lg:ml-8 px-2 sm:px-4 md:px-6 pt-2 sm:pt-4 md:pt-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 sm:mb-6"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Groups
                </h1>
              </div>
              <Button
                className="gap-2 bg-gradient-to-r from-primary to-primary/80"
                onClick={() => setShowCreateDialog(true)}
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Create Group</span>
              </Button>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground">
              Join communities and connect with like-minded people
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-4 sm:mb-6"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
              <Input
                placeholder="Search groups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 sm:pl-10 h-10 sm:h-12"
              />
            </div>
          </motion.div>

          {/* Groups Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {filteredGroups.map((group, index) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-all cursor-pointer" onClick={() => setSelectedGroup(group)}>
                  <div className="h-24 sm:h-32 overflow-hidden bg-muted">
                    <img src={group.cover} alt={group.name} className="w-full h-full object-cover" />
                  </div>
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-sm sm:text-base text-foreground line-clamp-1">{group.name}</h3>
                          {group.privacy === "private" ? (
                            <Lock className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                          ) : (
                            <Globe className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {group.members.toLocaleString()} members • {group.posts} posts
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant={joinedGroups.includes(group.id) ? "outline" : "default"}
                        className="flex-shrink-0 text-xs h-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleJoin(group.id);
                        }}
                      >
                        {joinedGroups.includes(group.id) ? (
                          <>
                            <UserMinus className="w-3 h-3 mr-1" />
                            Leave
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-3 h-3 mr-1" />
                            Join
                          </>
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{group.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <MobileNav />

      {/* Group Details Dialog */}
      <Dialog open={!!selectedGroup} onOpenChange={() => setSelectedGroup(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          {selectedGroup && (
            <>
              <div className="h-32 sm:h-40 -mx-6 -mt-6 mb-4 overflow-hidden">
                <img src={selectedGroup.cover} alt={selectedGroup.name} className="w-full h-full object-cover" />
              </div>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <DialogTitle className="text-lg sm:text-xl">{selectedGroup.name}</DialogTitle>
                  {selectedGroup.privacy === "private" ? (
                    <Badge variant="secondary" className="text-xs"><Lock className="w-3 h-3 mr-1" />Private</Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs"><Globe className="w-3 h-3 mr-1" />Public</Badge>
                  )}
                </div>
                <DialogDescription className="text-sm">{selectedGroup.description}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <Card>
                    <CardContent className="p-3">
                      <p className="font-bold text-lg">{selectedGroup.members.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Members</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-3">
                      <p className="font-bold text-lg">{selectedGroup.posts}</p>
                      <p className="text-xs text-muted-foreground">Posts</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-3">
                      <p className="font-bold text-lg">2023</p>
                      <p className="text-xs text-muted-foreground">Created</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedGroup.admin}`} />
                    <AvatarFallback>{selectedGroup.admin[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{selectedGroup.admin}</p>
                    <p className="text-xs text-muted-foreground">Admin</p>
                  </div>
                  <Settings className="w-4 h-4 text-muted-foreground" />
                </div>

                <Button
                  className="w-full"
                  variant={joinedGroups.includes(selectedGroup.id) ? "outline" : "default"}
                  onClick={() => toggleJoin(selectedGroup.id)}
                >
                  {joinedGroups.includes(selectedGroup.id) ? (
                    <>
                      <UserMinus className="w-4 h-4 mr-2" />
                      Leave Group
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Join Group
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Group Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Group</DialogTitle>
            <DialogDescription>Start a community for people with shared interests</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="h-24 rounded-lg bg-muted flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors">
              <div className="text-center">
                <ImageIcon className="w-8 h-8 mx-auto text-muted-foreground mb-1" />
                <p className="text-xs text-muted-foreground">Add cover photo</p>
              </div>
            </div>
            <div>
              <Label htmlFor="group-name">Group Name</Label>
              <Input
                id="group-name"
                placeholder="Enter group name"
                value={newGroup.name}
                onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="group-desc">Description</Label>
              <Textarea
                id="group-desc"
                placeholder="What is this group about?"
                value={newGroup.description}
                onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="group-privacy">Privacy</Label>
              <Select value={newGroup.privacy} onValueChange={(value) => setNewGroup({ ...newGroup, privacy: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public"><Globe className="w-4 h-4 inline mr-2" />Public</SelectItem>
                  <SelectItem value="private"><Lock className="w-4 h-4 inline mr-2" />Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" onClick={handleCreateGroup}>Create Group</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}