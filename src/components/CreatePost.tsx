import { Image, Video, Smile, X, FileText, BarChart3, UserX, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useState } from "react";

interface CreatePostProps {
  isOpen: boolean;
  onClose: () => void;
}

const postTypes = [
  { id: "text", icon: FileText, label: "Text Post", description: "Share your thoughts" },
  { id: "photo", icon: Image, label: "Photo Post", description: "Share images" },
  { id: "video", icon: Video, label: "Video Post", description: "Share videos" },
  { id: "poll", icon: BarChart3, label: "Create Poll", description: "Ask a question" },
  { id: "anonymous", icon: UserX, label: "Anonymous Post", description: "Post anonymously" },
  { id: "feeling", icon: MessageSquare, label: "Feeling/Activity", description: "Share how you feel" },
];

const CreatePost = ({ isOpen, onClose }: CreatePostProps) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleBack = () => {
    setSelectedType(null);
  };

  const handleClose = () => {
    setSelectedType(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50 p-4"
          >
            <Card className="p-4 sm:p-6 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                {selectedType ? (
                  <Button variant="ghost" size="sm" onClick={handleBack} className="text-sm">
                    ← Back
                  </Button>
                ) : (
                  <h2 className="text-lg sm:text-xl font-bold text-foreground">Create Post</h2>
                )}
                <Button variant="ghost" size="icon" onClick={handleClose}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {!selectedType ? (
                /* Post Type Selection List */
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground mb-3">Choose post type:</p>
                  {postTypes.map((type) => (
                    <Button
                      key={type.id}
                      variant="outline"
                      className="w-full justify-start gap-3 h-14 hover:bg-muted/50"
                      onClick={() => setSelectedType(type.id)}
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <type.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-foreground">{type.label}</p>
                        <p className="text-xs text-muted-foreground">{type.description}</p>
                      </div>
                    </Button>
                  ))}
                </div>
              ) : (
                /* Post Creation Form */
                <>
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

                  <Button className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:opacity-90">
                    Post
                  </Button>
                </>
              )}
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CreatePost;
