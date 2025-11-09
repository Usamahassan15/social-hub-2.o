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
      
      <main className="flex-1 pb-20 sm:pb-24 md:pb-8 lg:pb-10">
        <div className="max-w-4xl mx-auto pt-0">
          {/* Cover Photo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative h-40 sm:h-48 md:h-56 lg:h-64 xl:h-72 bg-gradient-to-br from-primary via-primary-glow to-accent rounded-b-xl sm:rounded-b-2xl md:rounded-b-3xl overflow-hidden"
          >
            <Button
              size="icon"
              variant="secondary"
              className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 md:bottom-5 md:right-6 shadow-lg"
            >
              <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </motion.div>

          <div className="px-3 sm:px-4 md:px-6 lg:px-8">
            {/* Profile Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative -mt-16 sm:-mt-20 md:-mt-20 mb-4 sm:mb-5 md:mb-6 lg:mb-8"
            >
              <div className="flex flex-col md:flex-row items-center md:items-end gap-3 sm:gap-4 md:gap-5 mb-4 sm:mb-5 md:mb-6">
                <div className="relative">
                  <Avatar className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 border-4 sm:border-[5px] border-background shadow-xl">
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=You" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute bottom-0 right-0 rounded-full shadow-md w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10"
                  >
                    <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </div>

                <div className="flex-1 text-center md:text-left space-y-2 sm:space-y-3">
                  <h1 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold text-foreground">John Doe</h1>
                  <p className="text-sm sm:text-base md:text-base text-muted-foreground px-4 md:px-0">
                    Full-stack developer | Tech enthusiast | Coffee lover ☕
                  </p>
                  
                  <div className="flex flex-wrap justify-center md:justify-start gap-3 sm:gap-4 md:gap-5 text-xs sm:text-sm text-muted-foreground">
                    <span className="flex items-center gap-1 sm:gap-1.5">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="truncate">San Francisco, CA</span>
                    </span>
                    <span className="flex items-center gap-1 sm:gap-1.5">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Joined March 2024</span>
                    </span>
                    <span className="flex items-center gap-1 sm:gap-1.5">
                      <LinkIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="truncate">johndoe.dev</span>
                    </span>
                  </div>
                </div>

                <Button variant="outline" size="icon" className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11">
                  <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </div>

              {/* Stats */}
              <div className="flex justify-center md:justify-start gap-6 sm:gap-8 md:gap-10 lg:gap-12">
                <div className="text-center">
                  <p className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold gradient-text">1.2K</p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold gradient-text">842</p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">Following</p>
                </div>
                <div className="text-center">
                  <p className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold gradient-text">156</p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">Posts</p>
                </div>
              </div>
            </motion.div>

            {/* Posts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6"
            >
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-3 sm:mb-4 md:mb-5">Posts</h2>
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
