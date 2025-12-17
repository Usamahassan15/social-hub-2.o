import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import TopBar from "@/components/TopBar";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const trendingTopics = [
  { id: 1, tag: "#Technology", posts: "45.2K posts" },
  { id: 2, tag: "#Design", posts: "32.1K posts" },
  { id: 3, tag: "#Startup", posts: "28.5K posts" },
  { id: 4, tag: "#AI", posts: "56.8K posts" },
];

const Explore = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <TopBar />
      
      {/* Mobile: Full-screen overlay with close button */}
      <main className="flex-1 md:ml-64 pb-16 md:pb-8 pt-14 md:pt-14 fixed md:relative inset-0 md:inset-auto z-50 md:z-auto bg-background">
        <div className="max-w-3xl lg:max-w-4xl mx-auto px-4 md:px-6 pt-4 md:pt-6 h-full overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[hsl(199,100%,50%)] to-[hsl(207,90%,54%)] bg-clip-text text-transparent">Explore</h1>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="md:hidden h-9 w-9"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="relative mb-8">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search for people, topics, or posts..."
                className="pl-10 h-12"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-bold text-foreground mb-4">Trending Topics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trendingTopics.map((topic, index) => (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="p-6 hover-lift cursor-pointer">
                    <h3 className="text-xl font-bold gradient-text mb-2">{topic.tag}</h3>
                    <p className="text-sm text-muted-foreground">{topic.posts}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default Explore;
