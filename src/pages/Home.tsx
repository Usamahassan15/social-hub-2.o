import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import TopBar from "@/components/TopBar";
import Stories from "@/components/Stories";
import Post from "@/components/Post";
import PeopleYouMayKnow from "@/components/PeopleYouMayKnow";
import CreatePost from "@/components/CreatePost";
import { Button } from "@/components/ui/button";

const posts = [
  {
    id: "1",
    name: "John Doe",
    username: "johndoe",
    avatar: "https://i.pravatar.cc/150?img=1",
    postImage: "https://source.unsplash.com/random/800x600",
    likes: 10,
    comments: [
      {
        username: "janedoe",
        text: "Great post!",
      },
    ],
    createdAt: "2023-12-06T12:00:00.000Z",
  },
  {
    id: "2",
    name: "Jane Doe",
    username: "janedoe",
    avatar: "https://i.pravatar.cc/150?img=2",
    postImage: "https://source.unsplash.com/random/800x601",
    likes: 15,
    comments: [],
    createdAt: "2023-12-05T12:00:00.000Z",
  },
  {
    id: "3",
    name: "Richard Roe",
    username: "richardroe",
    avatar: "https://i.pravatar.cc/150?img=3",
    postImage: "https://source.unsplash.com/random/800x602",
    likes: 20,
    comments: [],
    createdAt: "2023-12-04T12:00:00.000Z",
  },
  {
    id: "4",
    name: "John Smith",
    username: "johnsmith",
    avatar: "https://i.pravatar.cc/150?img=4",
    postImage: "https://source.unsplash.com/random/800x603",
    likes: 25,
    comments: [],
    createdAt: "2023-12-03T12:00:00.000Z",
  },
  {
    id: "5",
    name: "Jane Smith",
    username: "janesmith",
    avatar: "https://i.pravatar.cc/150?img=5",
    postImage: "https://source.unsplash.com/random/800x604",
    likes: 30,
    comments: [],
    createdAt: "2023-12-02T12:00:00.000Z",
  },
  {
    id: "6",
    name: "Robert Jones",
    username: "robertjones",
    avatar: "https://i.pravatar.cc/150?img=6",
    postImage: "https://source.unsplash.com/random/800x605",
    likes: 35,
    comments: [],
    createdAt: "2023-12-01T12:00:00.000Z",
  },
];

const Home = () => {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <TopBar />
      
      <main className="flex-1 md:ml-64 pb-16 md:pb-8 pt-14 md:pt-14">
        <div className="w-full max-w-[100vw] sm:max-w-xl lg:max-w-[680px] lg:mx-0 lg:ml-8 mx-auto px-0 sm:px-4 md:px-6 pt-2 sm:pt-4 md:pt-8 overflow-hidden">
          {/* Stories */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 sm:mb-4 md:mb-5 lg:mb-6"
          >
            <Stories />
          </motion.div>

          {/* Posts Feed with People You May Know inserted every 5 posts */}
          <div className="space-y-3 sm:space-y-4">
            {posts.map((post, index) => (
              <React.Fragment key={post.id}>
                {index > 0 && index % 5 === 0 && (
                  <PeopleYouMayKnow />
                )}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Post {...post} />
                </motion.div>
              </React.Fragment>
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
