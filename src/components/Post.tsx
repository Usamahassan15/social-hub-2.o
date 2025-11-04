import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface PostProps {
  author: string;
  avatar: string;
  time: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
}

const Post = ({ author, avatar, time, content, image, likes, comments }: PostProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="p-4 hover-lift">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={avatar} />
              <AvatarFallback>{author[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-foreground">{author}</h3>
              <p className="text-sm text-muted-foreground">{time}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <p className="text-foreground mb-4">{content}</p>

        {/* Image */}
        {image && (
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="rounded-lg overflow-hidden mb-4 bg-muted"
          >
            <img src={image} alt="Post" className="w-full object-cover" />
          </motion.div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3 pb-3 border-b border-border">
          <span>{likes} likes</span>
          <span>{comments} comments</span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-around">
          <ActionButton icon={Heart} label="Like" />
          <ActionButton icon={MessageCircle} label="Comment" />
          <ActionButton icon={Share2} label="Share" />
          <ActionButton icon={Bookmark} label="Save" />
        </div>
      </Card>
    </motion.div>
  );
};

const ActionButton = ({ icon: Icon, label }: { icon: any; label: string }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-muted transition-colors text-foreground"
  >
    <Icon className="w-5 h-5" />
    <span className="text-sm font-medium">{label}</span>
  </motion.button>
);

export default Post;
