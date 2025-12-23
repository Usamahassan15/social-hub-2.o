import { Calendar, MapPin, Link as LinkIcon, Camera, Edit, Plus, Settings, Image, Type } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import TopBar from "@/components/TopBar";
import Post from "@/components/Post";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const userPosts = [
  {
    id: 1,
    author: "You",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
    time: "1 day ago",
    content: "Excited to share my latest achievement! 🎉",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
    likes: 342,
    comments: 67,
  },
  {
    id: 2,
    author: "You",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
    time: "3 days ago",
    content: "Beautiful morning walk today! 🌅",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    likes: 189,
    comments: 23,
  },
];

const userPhotos = [
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop",
];

export default function Profile() {
  const navigate = useNavigate();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isStoryOptionsOpen, setIsStoryOptionsOpen] = useState(false);
  const [isTextStoryOpen, setIsTextStoryOpen] = useState(false);
  const [storyBackground, setStoryBackground] = useState("#199AE3");
  const [activeTab, setActiveTab] = useState("posts");
  
  const [profileData, setProfileData] = useState({
    name: "Alex Johnson",
    bio: "Digital creator | Travel enthusiast | Coffee lover ☕",
    location: "San Francisco, CA",
    website: "alexjohnson.com"
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("Image selected:", file);
      setIsStoryOptionsOpen(false);
    }
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <TopBar />
      
      <main className="flex-1 md:ml-64 pb-16 md:pb-8 pt-14 md:pt-14">
        <div className="max-w-full sm:max-w-xl lg:max-w-2xl mx-auto px-0 sm:px-4 md:px-6">
          {/* Cover Photo */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative h-40 sm:h-48 md:h-56 lg:h-64 bg-gradient-to-r from-primary to-primary-glow rounded-b-xl md:rounded-b-2xl overflow-hidden"
          >
            <Button 
              variant="secondary" 
              size="sm"
              className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 gap-2 h-8 sm:h-9 text-xs sm:text-sm"
            >
              <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Edit Cover</span>
            </Button>
          </motion.div>

          {/* Profile Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-3 sm:px-4 md:px-6 pb-4 sm:pb-6"
          >
            <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 -mt-12 sm:-mt-14 md:-mt-16">
              <div className="relative">
                <Avatar className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 border-3 sm:border-4 border-background shadow-lg">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" />
                  <AvatarFallback>AJ</AvatarFallback>
                </Avatar>
                <label className="absolute -bottom-1 -right-1 cursor-pointer">
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => console.log("Profile photo:", e.target.files?.[0])} />
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary flex items-center justify-center shadow-lg">
                    <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
                  </div>
                </label>
              </div>
              <div className="flex flex-wrap gap-2 sm:mt-16 md:mt-20 w-full sm:w-auto">
                <Button 
                  variant="default" 
                  size="sm" 
                  className="gap-2 flex-1 sm:flex-none h-9 sm:h-10"
                  onClick={() => setIsEditProfileOpen(true)}
                >
                  <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                  Edit Profile
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2 flex-1 sm:flex-none h-9 sm:h-10"
                  onClick={() => setIsStoryOptionsOpen(true)}
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                  Your Story
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-9 w-9 sm:h-10 sm:w-10"
                  onClick={handleSettingsClick}
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-1">{profileData.name}</h1>
                <p className="text-sm sm:text-base text-muted-foreground">{profileData.bio}</p>
              </div>

              <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>{profileData.location}</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Joined March 2024</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <LinkIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <a href="#" className="text-primary hover:underline">{profileData.website}</a>
                </div>
              </div>

              <div className="flex gap-4 sm:gap-6 text-sm sm:text-base">
                <div>
                  <span className="font-bold text-foreground">1.2K</span>
                  <span className="text-muted-foreground ml-1 text-xs sm:text-sm">Followers</span>
                </div>
                <div>
                  <span className="font-bold text-foreground">842</span>
                  <span className="text-muted-foreground ml-1 text-xs sm:text-sm">Following</span>
                </div>
                <div>
                  <span className="font-bold text-foreground">145</span>
                  <span className="text-muted-foreground ml-1 text-xs sm:text-sm">Posts</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Posts/Photos Tabs */}
          <div className="px-0 sm:px-4 md:px-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full grid grid-cols-2 mb-4">
                <TabsTrigger value="posts" className="gap-2">
                  <Image className="w-4 h-4" />
                  Posts
                </TabsTrigger>
                <TabsTrigger value="photos" className="gap-2">
                  <Image className="w-4 h-4" />
                  Photos
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="posts" className="space-y-3 sm:space-y-4">
                {userPosts.map((post) => (
                  <Post key={post.id} {...post} />
                ))}
              </TabsContent>
              
              <TabsContent value="photos">
                <div className="grid grid-cols-3 gap-1 sm:gap-2">
                  {userPhotos.map((photo, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="aspect-square overflow-hidden rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                    >
                      <img
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <MobileNav />

      {/* Edit Profile Dialog */}
      <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>Update your personal information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                value={profileData.name}
                onChange={(e) => setProfileData({...profileData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea 
                id="bio" 
                value={profileData.bio}
                onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location" 
                value={profileData.location}
                onChange={(e) => setProfileData({...profileData, location: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input 
                id="website" 
                value={profileData.website}
                onChange={(e) => setProfileData({...profileData, website: e.target.value})}
              />
            </div>
            <Button className="w-full" onClick={() => setIsEditProfileOpen(false)}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Story Options Dialog */}
      <Dialog open={isStoryOptionsOpen} onOpenChange={setIsStoryOptionsOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Create Your Story</DialogTitle>
            <DialogDescription>Choose how you want to share your story</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-4">
            <label className="block">
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageUpload}
              />
              <Button variant="outline" className="w-full gap-2 h-12" asChild>
                <span className="cursor-pointer">
                  <Image className="w-5 h-5" />
                  Create a Photo Story
                </span>
              </Button>
            </label>
            <Button 
              variant="outline" 
              className="w-full gap-2 h-12"
              onClick={() => {
                setIsStoryOptionsOpen(false);
                setIsTextStoryOpen(true);
              }}
            >
              <Type className="w-5 h-5" />
              Create a Text Story
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Text Story Dialog */}
      <Dialog open={isTextStoryOpen} onOpenChange={setIsTextStoryOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Text Story</DialogTitle>
            <DialogDescription>Share your thoughts with a colorful background</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Background Color</Label>
              <div className="flex gap-2 flex-wrap">
                {['#199AE3', '#E31199', '#11E399', '#E39911', '#9911E3', '#11E3E3'].map((color) => (
                  <button
                    key={color}
                    className="w-10 h-10 rounded-full border-2 border-border"
                    style={{ backgroundColor: color }}
                    onClick={() => setStoryBackground(color)}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="story-text">Your Story</Label>
              <div 
                className="rounded-lg p-6 min-h-[200px] flex items-center justify-center"
                style={{ backgroundColor: storyBackground }}
              >
                <Textarea 
                  id="story-text"
                  placeholder="Type your story here..."
                  className="bg-transparent border-none text-white text-center text-lg placeholder:text-white/70 resize-none"
                  rows={5}
                />
              </div>
            </div>
            <Button className="w-full" onClick={() => setIsTextStoryOpen(false)}>
              Post Story
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}