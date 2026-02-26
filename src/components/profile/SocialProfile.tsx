import { Image } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import Post from "@/components/Post";
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

export default function SocialProfile() {
  const [activeTab, setActiveTab] = useState("posts");

  return (
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
              <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
            </motion.div>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
