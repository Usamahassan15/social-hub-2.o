import { motion } from "framer-motion";
import { Camera, MapPin, Calendar, Link as LinkIcon, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import Post from "@/components/Post";

const Profile = () => {
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
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 pb-28 md:pb-8">
        <div className="max-w-4xl mx-auto pt-4 md:pt-0">
          {/* Cover Photo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative h-64 bg-gradient-to-br from-primary via-primary-glow to-accent rounded-b-2xl"
          >
            <Button
              size="icon"
              variant="secondary"
              className="absolute bottom-4 right-4"
            >
              <Camera className="w-5 h-5" />
            </Button>
          </motion.div>

          <div className="px-4 md:px-6">
            {/* Profile Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative -mt-20 mb-6"
            >
              <div className="flex flex-col md:flex-row items-center md:items-end gap-4 mb-4">
                <div className="relative">
                  <Avatar className="w-32 h-32 border-4 border-background">
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=You" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute bottom-0 right-0 rounded-full"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold text-foreground mb-1">John Doe</h1>
                  <p className="text-muted-foreground mb-3">
                    Full-stack developer | Tech enthusiast | Coffee lover ☕
                  </p>
                  
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      San Francisco, CA
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Joined March 2024
                    </span>
                    <span className="flex items-center gap-1">
                      <LinkIcon className="w-4 h-4" />
                      johndoe.dev
                    </span>
                  </div>
                </div>

                <Button variant="outline" size="icon">
                  <Settings className="w-5 h-5" />
                </Button>
              </div>

              {/* Stats */}
              <div className="flex justify-center md:justify-start gap-8">
                <div className="text-center">
                  <p className="text-2xl font-bold gradient-text">1.2K</p>
                  <p className="text-sm text-muted-foreground">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold gradient-text">842</p>
                  <p className="text-sm text-muted-foreground">Following</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold gradient-text">156</p>
                  <p className="text-sm text-muted-foreground">Posts</p>
                </div>
              </div>
            </motion.div>

            {/* Posts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-bold text-foreground mb-4">Posts</h2>
              {userPosts.map((post) => (
                <Post key={post.id} {...post} />
              ))}
            </motion.div>
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default Profile;
