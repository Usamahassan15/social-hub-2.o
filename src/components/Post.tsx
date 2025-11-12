import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");
  const [likeCount, setLikeCount] = useState(likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleComment = () => {
    if (comment.trim()) {
      console.log("Comment posted:", comment);
      setComment("");
      setShowComments(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="p-2 sm:p-3 md:p-4 hover-lift">
        {/* Header */}
        <div className="flex items-center justify-between mb-1.5 sm:mb-2 md:mb-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <Avatar className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10">
              <AvatarImage src={avatar} />
              <AvatarFallback>{author[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-xs sm:text-sm text-foreground">{author}</h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground">{time}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8">
            <MoreHorizontal className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
          </Button>
        </div>

        {/* Content */}
        <p className="text-xs sm:text-sm md:text-base text-foreground mb-1.5 sm:mb-2 md:mb-3">{content}</p>

        {/* Image */}
        {image && (
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="rounded-md sm:rounded-lg overflow-hidden mb-1.5 sm:mb-2 md:mb-3 bg-muted"
          >
            <img src={image} alt="Post" className="w-full object-cover max-h-48 sm:max-h-64 md:max-h-80 lg:max-h-96" />
          </motion.div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-[10px] sm:text-xs md:text-sm text-muted-foreground mb-1 sm:mb-1.5 md:mb-2 pb-1 sm:pb-1.5 md:pb-2 border-b border-border">
          <span>{likeCount} likes</span>
          <span>{comments} comments</span>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-4 gap-0.5 sm:gap-1 md:gap-2 mb-1.5 sm:mb-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLike}
            className="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1 px-0.5 sm:px-1.5 md:px-2 py-1 sm:py-1.5 md:py-2 rounded-md hover:bg-muted transition-colors"
          >
            <AnimatePresence mode="wait">
              {isLiked && (
                <motion.div
                  key="liked"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.3, 1] }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 fill-red-500 text-red-500" />
                </motion.div>
              )}
              {!isLiked && (
                <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-foreground" />
              )}
            </AnimatePresence>
            <span className="text-[10px] sm:text-xs md:text-sm font-medium text-foreground">Like</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowComments(!showComments)}
            className="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1 px-0.5 sm:px-1.5 md:px-2 py-1 sm:py-1.5 md:py-2 rounded-md hover:bg-muted transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-foreground" />
            <span className="text-[10px] sm:text-xs md:text-sm font-medium text-foreground">Comment</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1 px-0.5 sm:px-1.5 md:px-2 py-1 sm:py-1.5 md:py-2 rounded-md hover:bg-muted transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-foreground" />
            <span className="text-[10px] sm:text-xs md:text-sm font-medium text-foreground">Share</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsSaved(!isSaved)}
            className="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1 px-0.5 sm:px-1.5 md:px-2 py-1 sm:py-1.5 md:py-2 rounded-md hover:bg-muted transition-colors"
          >
            <Bookmark className={`w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 ${isSaved ? 'fill-primary text-primary' : 'text-foreground'}`} />
            <span className="text-[10px] sm:text-xs md:text-sm font-medium text-foreground">Save</span>
          </motion.button>
        </div>

        {/* Comment Input */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="flex gap-1 sm:gap-1.5 md:gap-2 pt-1 sm:pt-1.5 md:pt-2 border-t border-border">
                <Input 
                  placeholder="Write a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                  className="flex-1 h-7 sm:h-8 md:h-9 text-xs sm:text-sm"
                />
                <Button 
                  size="sm" 
                  onClick={handleComment}
                  className="h-7 sm:h-8 md:h-9 px-1.5 sm:px-2 md:px-3"
                >
                  <Send className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

export default Post;
