import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const stories = [
  { id: 1, name: "Your Story", image: null, isAdd: true },
  { id: 2, name: "Sarah", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
  { id: 3, name: "Mike", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike" },
  { id: 4, name: "Emma", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma" },
  { id: 5, name: "Jake", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jake" },
  { id: 6, name: "Olivia", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia" },
];

const Stories = () => {
  return (
    <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
      {stories.map((story, index) => (
        <motion.div
          key={story.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-shrink-0 cursor-pointer"
        >
          <div className="relative">
            {story.isAdd ? (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center glow-effect">
                <Plus className="w-8 h-8 text-primary-foreground" />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full p-[3px] bg-gradient-to-br from-primary to-primary-glow glow-effect">
                <Avatar className="w-full h-full border-4 border-background">
                  <AvatarImage src={story.image || undefined} />
                  <AvatarFallback>{story.name[0]}</AvatarFallback>
                </Avatar>
              </div>
            )}
          </div>
          <p className="text-xs text-center mt-2 text-foreground font-medium truncate w-20">
            {story.name}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

export default Stories;
