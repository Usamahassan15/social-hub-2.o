import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Send, UserPlus, Flag, Ban, Camera, Smile, TrendingUp, Zap } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePostEngagement, useUserInterests } from "@/hooks/use-feed";
import { useUISound } from "@/hooks/use-ui-sound";
import { useContentModeration } from "@/hooks/use-content-moderation";
import ModerationWarningDialog from "./ModerationWarningDialog";
import { toast } from "@/hooks/use-toast";

interface LivePostProps {
  id: string;
  user_id: string;
  content: string;
  media_url?: string;
  media_type?: string;
  category?: string;
  is_anonymous: boolean;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  saves_count: number;
  created_at: string;
  is_trending?: boolean;
  is_featured?: boolean;
  _score?: number;
  // Display info (from profile join or placeholder)
  author?: string;
  avatar?: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  technology: "bg-blue-500/10 text-blue-600",
  design: "bg-purple-500/10 text-purple-600",
  startup: "bg-green-500/10 text-green-600",
  ai: "bg-cyan-500/10 text-cyan-600",
  business: "bg-amber-500/10 text-amber-600",
  science: "bg-emerald-500/10 text-emerald-600",
  art: "bg-pink-500/10 text-pink-600",
  sports: "bg-orange-500/10 text-orange-600",
  music: "bg-violet-500/10 text-violet-600",
  travel: "bg-teal-500/10 text-teal-600",
};

const LivePost = ({
  id,
  user_id,
  content,
  media_url,
  category,
  is_anonymous,
  likes_count: initialLikes,
  comments_count,
  shares_count,
  saves_count,
  created_at,
  is_trending,
  is_featured,
  author,
  avatar,
}: LivePostProps) => {
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");
  const [showModerationWarning, setShowModerationWarning] = useState(false);
  const [moderationData, setModerationData] = useState<any>(null);
  const [localLikes, setLocalLikes] = useState(initialLikes);
  const [localSaves, setLocalSaves] = useState(saves_count);

  const { isLiked, isSaved, toggleLike, toggleSave, recordShare, recordView } = usePostEngagement(id);
  const { updateInterest } = useUserInterests();
  const { moderateText, isChecking } = useContentModeration();
  const playLike = useUISound("like");
  const playComment = useUISound("comment");
  const playShare = useUISound("share");
  const playSave = useUISound("save");

  // Record view on mount
  useEffect(() => {
    recordView();
    if (category) {
      updateInterest({ category, delta: 0.02 }); // Small boost for viewing
    }
  }, []);

  const displayName = is_anonymous ? "Anonymous" : (author || "User");
  const displayAvatar = is_anonymous ? undefined : (avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user_id}`);

  const formatTime = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    if (hrs < 24) return `${hrs}h ago`;
    return `${days}d ago`;
  };

  const handleLike = () => {
    if (!isLiked) {
      playLike();
      setLocalLikes(prev => prev + 1);
      if (category) updateInterest({ category, delta: 0.05 });
    } else {
      setLocalLikes(prev => Math.max(0, prev - 1));
    }
    toggleLike();
  };

  const handleSave = () => {
    playSave();
    setLocalSaves(prev => isSaved ? Math.max(0, prev - 1) : prev + 1);
    toggleSave();
    if (!isSaved && category) updateInterest({ category, delta: 0.08 });
  };

  const handleShare = () => {
    playShare();
    recordShare();
    if (category) updateInterest({ category, delta: 0.06 });
    toast({ title: "Link copied to clipboard!" });
  };

  const handleComment = async () => {
    if (!comment.trim()) return;
    const result = await moderateText(comment, "comment");
    if (!result.allowed) {
      setModerationData(result);
      setShowModerationWarning(true);
      return;
    }
    playComment();
    if (category) updateInterest({ category, delta: 0.1 }); // Strong signal
    toast({ title: "Comment posted!" });
    setComment("");
  };

  const catColor = category ? (CATEGORY_COLORS[category.toLowerCase()] || "bg-muted text-muted-foreground") : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="p-0 overflow-hidden rounded-lg sm:rounded-xl border border-border/30 sm:border-border max-w-full">
        {/* Trending/Featured Banner */}
        {(is_trending || is_featured) && (
          <div className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium ${
            is_featured 
              ? "bg-gradient-to-r from-primary/20 to-primary/5 text-primary border-b border-primary/20" 
              : "bg-gradient-to-r from-orange-500/15 to-orange-500/5 text-orange-600 border-b border-orange-500/20"
          }`}>
            {is_featured ? (
              <><Zap className="w-3.5 h-3.5" /> Featured Post</>
            ) : (
              <><TrendingUp className="w-3.5 h-3.5" /> Trending</>
            )}
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between px-2 sm:px-3 py-2">
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8 sm:w-9 sm:h-9">
              {displayAvatar && <AvatarFallback className="bg-gradient-to-br from-primary/30 to-primary/10 text-primary font-semibold">{displayName[0]}</AvatarFallback>}
            </Avatar>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-semibold text-sm sm:text-base text-foreground leading-tight">{displayName}</h3>
                {catColor && category && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${catColor}`}>
                    {category}
                  </span>
                )}
              </div>
              <p className="text-[11px] sm:text-xs text-muted-foreground">{formatTime(created_at)}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>
                <UserPlus className="w-4 h-4 mr-2" /> Follow
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Flag className="w-4 h-4 mr-2" /> Report
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <Ban className="w-4 h-4 mr-2" /> Block
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Content */}
        <p className="text-sm sm:text-base text-foreground px-2 sm:px-3 pb-2 leading-relaxed">{content}</p>

        {/* Media */}
        {media_url && (
          <div className="overflow-hidden bg-muted">
            <AspectRatio ratio={4 / 3} className="w-full">
              <img src={media_url} alt="Post" className="w-full h-full object-cover" />
            </AspectRatio>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-[10px] sm:text-xs text-muted-foreground px-2 sm:px-3 py-1.5 border-b border-border">
          <span>{localLikes.toLocaleString()} likes</span>
          <span>{comments_count.toLocaleString()} comments · {shares_count.toLocaleString()} shares · {localSaves.toLocaleString()} saves</span>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-4 gap-0.5 px-1 sm:px-2 py-1">
          {[
            {
              icon: Heart,
              label: "Like",
              active: isLiked,
              activeClass: "fill-red-500 text-red-500",
              onClick: handleLike,
            },
            {
              icon: MessageCircle,
              label: "Comment",
              active: showComments,
              activeClass: "text-primary",
              onClick: () => setShowComments(!showComments),
            },
            {
              icon: Share2,
              label: "Share",
              active: false,
              activeClass: "",
              onClick: handleShare,
            },
            {
              icon: Bookmark,
              label: "Save",
              active: isSaved,
              activeClass: "fill-primary text-primary",
              onClick: handleSave,
            },
          ].map(({ icon: Icon, label, active, activeClass, onClick }) => (
            <motion.button
              key={label}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClick}
              className="flex flex-col sm:flex-row items-center justify-center gap-0.5 px-1 py-1.5 rounded-md hover:bg-muted transition-colors"
            >
              <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${active ? activeClass : "text-foreground"}`} />
              <span className="text-[10px] sm:text-xs font-medium text-foreground">{label}</span>
            </motion.button>
          ))}
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
              <div className="flex items-center gap-1 px-2 sm:px-3 py-2 border-t border-border">
                <Input
                  placeholder="Write a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleComment()}
                  className="flex-1 h-8 sm:h-9 text-xs sm:text-sm"
                />
                <Button
                  size="sm"
                  onClick={handleComment}
                  disabled={!comment.trim() || isChecking}
                  className="h-8 sm:h-9 px-2 sm:px-3"
                >
                  <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      <ModerationWarningDialog
        isOpen={showModerationWarning}
        onClose={() => setShowModerationWarning(false)}
        warningNumber={moderationData?.warning_number}
        isBanned={moderationData?.is_banned}
        banDurationHours={moderationData?.ban_duration_hours}
        banEndsAt={moderationData?.ban_ends_at}
        message={moderationData?.message}
      />
    </motion.div>
  );
};

export default LivePost;
