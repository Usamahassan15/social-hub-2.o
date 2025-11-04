import { motion } from "framer-motion";
import { Search } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const trendingTopics = [
  { id: 1, tag: "#Technology", posts: "45.2K posts" },
  { id: 2, tag: "#Design", posts: "32.1K posts" },
  { id: 3, tag: "#Startup", posts: "28.5K posts" },
  { id: 4, tag: "#AI", posts: "56.8K posts" },
];

const Explore = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 pb-28 md:pb-8">
        <div className="max-w-4xl mx-auto p-4 md:p-6 pt-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold gradient-text mb-6">Explore</h1>
            
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
