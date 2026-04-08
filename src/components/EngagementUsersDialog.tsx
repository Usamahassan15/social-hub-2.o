import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, Share2, Bookmark, MessageCircle, UserPlus, UserCheck } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

type EngagementType = "likes" | "comments" | "shares" | "saves";

interface EngagementUser {
  id: number;
  name: string;
  avatar: string;
  time: string;
  comment?: string;
}

interface EngagementUsersDialogProps {
  isOpen: boolean;
  onClose: () => void;
  type: EngagementType;
  count: number;
}

const MOCK_USERS: Record<EngagementType, EngagementUser[]> = {
  likes: [
    { id: 1, name: "Sarah Ahmed", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah", time: "2m ago" },
    { id: 2, name: "Ali Khan", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ali", time: "5m ago" },
    { id: 3, name: "Fatima Noor", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima", time: "12m ago" },
    { id: 4, name: "Usman Malik", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Usman", time: "30m ago" },
    { id: 5, name: "Ayesha Siddiq", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ayesha", time: "1h ago" },
    { id: 6, name: "Hassan Raza", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hassan", time: "2h ago" },
    { id: 7, name: "Zara Imran", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zara", time: "3h ago" },
  ],
  comments: [
    { id: 1, name: "Sarah Ahmed", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah", time: "2m ago", comment: "This is amazing! Keep up the great work 🔥" },
    { id: 2, name: "Ali Khan", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ali", time: "10m ago", comment: "Love this post! Very inspiring ❤️" },
    { id: 3, name: "Fatima Noor", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima", time: "25m ago", comment: "Congratulations! Well deserved 🎉" },
    { id: 4, name: "Usman Malik", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Usman", time: "1h ago", comment: "Beautiful capture! Where was this taken?" },
    { id: 5, name: "Ayesha Siddiq", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ayesha", time: "2h ago", comment: "So cool! Would love to know more about this." },
  ],
  shares: [
    { id: 1, name: "Ali Khan", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ali", time: "5m ago" },
    { id: 2, name: "Usman Malik", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Usman", time: "15m ago" },
    { id: 3, name: "Hassan Raza", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hassan", time: "1h ago" },
  ],
  saves: [
    { id: 1, name: "Fatima Noor", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima", time: "3m ago" },
    { id: 2, name: "Zara Imran", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zara", time: "20m ago" },
    { id: 3, name: "Ayesha Siddiq", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ayesha", time: "45m ago" },
    { id: 4, name: "Sarah Ahmed", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah", time: "2h ago" },
  ],
};

const ICONS: Record<EngagementType, React.ReactNode> = {
  likes: <Heart className="w-4 h-4 fill-red-500 text-red-500" />,
  comments: <MessageCircle className="w-4 h-4 text-primary" />,
  shares: <Share2 className="w-4 h-4 text-primary" />,
  saves: <Bookmark className="w-4 h-4 fill-primary text-primary" />,
};

const TITLES: Record<EngagementType, string> = {
  likes: "Likes",
  comments: "Comments",
  shares: "Shares",
  saves: "Saves",
};

const EngagementUsersDialog = ({ isOpen, onClose, type, count }: EngagementUsersDialogProps) => {
  const [followingIds, setFollowingIds] = useState<Set<number>>(new Set());
  const users = MOCK_USERS[type];

  const toggleFollow = (id: number) => {
    setFollowingIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] p-0">
        <DialogHeader className="px-4 pt-4 pb-2 border-b border-border">
          <DialogTitle className="flex items-center gap-2 text-base">
            {ICONS[type]}
            {count} {TITLES[type]}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="px-3 py-2 space-y-1">
            {users.map((user, i) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`flex gap-3 p-2.5 rounded-xl hover:bg-muted/50 transition-colors ${type === "comments" ? "items-start" : "items-center"}`}
              >
                <Avatar className="w-9 h-9 flex-shrink-0">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                      {type !== "comments" && (
                        <p className="text-[11px] text-muted-foreground">{user.time}</p>
                      )}
                    </div>
                    {type !== "comments" && (
                      <Button
                        variant={followingIds.has(user.id) ? "outline" : "default"}
                        size="sm"
                        className="h-7 px-3 text-[11px] flex-shrink-0"
                        onClick={() => toggleFollow(user.id)}
                      >
                        {followingIds.has(user.id) ? (
                          <><UserCheck className="w-3 h-3 mr-1" /> Following</>
                        ) : (
                          <><UserPlus className="w-3 h-3 mr-1" /> Follow</>
                        )}
                      </Button>
                    )}
                  </div>
                  {type === "comments" && user.comment && (
                    <div className="mt-1 bg-muted/60 rounded-lg px-3 py-2">
                      <p className="text-sm text-foreground leading-relaxed">{user.comment}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{user.time}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default EngagementUsersDialog;
