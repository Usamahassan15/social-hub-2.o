import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import TopBar from "@/components/TopBar";
import Stories from "@/components/Stories";
import Post from "@/components/Post";
import CreatePost from "@/components/CreatePost";
import { Button } from "@/components/ui/button";

const posts = [
  {
    id: 1,
    author: "Sarah Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    time: "2 hours ago",
    content: "Just launched my new project! 🚀 Excited to share it with everyone. Check it out and let me know what you think!",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop",
    likes: 234,
    comments: 45,
  },
  {
    id: 2,
    author: "Mike Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    time: "5 hours ago",
    content: "Beautiful sunset today! Nature never fails to amaze me. 🌅",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    likes: 567,
    comments: 89,
  },
  {
    id: 3,
    author: "Emma Wilson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    time: "8 hours ago",
    content: "Coffee and code - the perfect combination for a productive morning! ☕️💻",
    likes: 189,
    comments: 23,
  },
];

const Home = () => {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <TopBar />
      
      <main className="flex-1 md:ml-64 pb-16 md:pb-8 pt-14 md:pt-14">
        <div className="w-full max-w-full sm:max-w-xl lg:max-w-2xl mx-auto px-1 sm:px-4 md:px-6 pt-2 sm:pt-4 md:pt-8">
          {/* Stories */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 sm:mb-4 md:mb-5 lg:mb-6"
          >
            <Stories />
          </motion.div>

          {/* Posts Feed */}
          <div className="space-y-3 sm:space-y-4">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Post {...post} />
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <MobileNav />

      {/* Floating Action Button - Hidden on Mobile, visible on Desktop */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="hidden md:block fixed bottom-8 right-6 z-40"
      >
        <Button
          size="icon"
          onClick={() => setIsCreatePostOpen(true)}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-[hsl(199,100%,50%)] to-[hsl(207,90%,54%)] shadow-lg hover:shadow-xl"
        >
          <Plus className="w-7 h-7" />
        </Button>
      </motion.div>

      <CreatePost isOpen={isCreatePostOpen} onClose={() => setIsCreatePostOpen(false)} />
    </div>
  );
};

export default Home;