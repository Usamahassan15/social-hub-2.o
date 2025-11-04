import { Image, Video, Smile, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

interface CreatePostProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatePost = ({ isOpen, onClose }: CreatePostProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50 p-4"
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">Create Post</h2>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex items-start gap-3 mb-4">
                <Avatar>
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=You" />
                  <AvatarFallback>You</AvatarFallback>
                </Avatar>
                <Textarea
                  placeholder="What's on your mind?"
                  className="min-h-32 resize-none"
                />
              </div>

              <div className="flex items-center gap-2 mb-4 p-3 rounded-lg border border-border">
                <span className="text-sm font-medium text-foreground">Add to post:</span>
                <Button variant="ghost" size="icon" className="text-primary">
                  <Image className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-primary">
                  <Video className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-primary">
                  <Smile className="w-5 h-5" />
                </Button>
              </div>

              <Button className="w-full h-12 bg-gradient-to-r from-primary to-primary-glow hover:opacity-90">
                Post
              </Button>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CreatePost;
