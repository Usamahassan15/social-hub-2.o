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
      <Card className="p-3 sm:p-4 hover-lift">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <Avatar className="w-10 h-10 sm:w-12 sm:h-12">
              <AvatarImage src={avatar} />
              <AvatarFallback>{author[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-sm sm:text-base text-foreground">{author}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">{time}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
            <MoreHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>

        {/* Content */}
        <p className="text-sm sm:text-base text-foreground mb-3 sm:mb-4">{content}</p>

        {/* Image */}
        {image && (
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="rounded-lg overflow-hidden mb-3 sm:mb-4 bg-muted"
          >
            <img src={image} alt="Post" className="w-full object-cover max-h-96 sm:max-h-[500px]" />
          </motion.div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 pb-2 sm:pb-3 border-b border-border">
          <span>{likeCount} likes</span>
          <span>{comments} comments</span>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-4 gap-1 sm:gap-2 mb-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLike}
            className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg hover:bg-muted transition-colors"
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
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-red-500 text-red-500" />
                </motion.div>
              )}
              {!isLiked && (
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
              )}
            </AnimatePresence>
            <span className="text-xs sm:text-sm font-medium text-foreground">Like</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowComments(!showComments)}
            className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg hover:bg-muted transition-colors"
          >
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
            <span className="text-xs sm:text-sm font-medium text-foreground">Comment</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg hover:bg-muted transition-colors"
          >
            <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
            <span className="text-xs sm:text-sm font-medium text-foreground">Share</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsSaved(!isSaved)}
            className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg hover:bg-muted transition-colors"
          >
            <Bookmark className={`w-4 h-4 sm:w-5 sm:h-5 ${isSaved ? 'fill-primary text-primary' : 'text-foreground'}`} />
            <span className="text-xs sm:text-sm font-medium text-foreground">Save</span>
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
              <div className="flex gap-2 pt-2 border-t border-border">
                <Input 
                  placeholder="Write a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                  className="flex-1 h-9 sm:h-10 text-sm"
                />
                <Button 
                  size="sm" 
                  onClick={handleComment}
                  className="h-9 sm:h-10 px-3"
                >
                  <Send className="w-4 h-4" />
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
