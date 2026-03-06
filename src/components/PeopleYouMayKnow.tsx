import { Users, ChevronRight, X } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export interface SuggestedUser {
  id: number;
  name: string;
  avatar: string;
  mutualFriends: number;
}

export const suggestedUsers: SuggestedUser[] = [
  { id: 1, name: "Jessica Lee", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica", mutualFriends: 12 },
  { id: 2, name: "David Park", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David", mutualFriends: 8 },
  { id: 3, name: "Olivia Brown", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia", mutualFriends: 5 },
  { id: 4, name: "James Wilson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James", mutualFriends: 3 },
  { id: 5, name: "Sophia Davis", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia", mutualFriends: 15 },
  { id: 6, name: "Liam Martinez", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Liam", mutualFriends: 7 },
  { id: 7, name: "Ava Thompson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ava", mutualFriends: 9 },
  { id: 8, name: "Noah Garcia", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Noah", mutualFriends: 4 },
];

const PeopleYouMayKnow = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState(suggestedUsers);
  const [following, setFollowing] = useState<Set<number>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const mark = (e: TouchEvent) => { (e as any).__storySwipe = true; };
    el.addEventListener("touchstart", mark, { passive: true });
    el.addEventListener("touchmove", mark, { passive: true });
    el.addEventListener("touchend", mark, { passive: true });
    return () => {
      el.removeEventListener("touchstart", mark);
      el.removeEventListener("touchmove", mark);
      el.removeEventListener("touchend", mark);
    };
  }, []);

  const handleFollow = (id: number, name: string) => {
    setFollowing(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        toast({ title: `Unfollowed ${name}` });
      } else {
        next.add(id);
        toast({ title: `Following ${name}` });
      }
      return next;
    });
  };

  const handleRemove = (id: number) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  if (users.length === 0) return null;

  return (
    <div className="mb-3 sm:mb-4">
      {/* Header */}
      <div className="flex items-center justify-between px-2 sm:px-0 mb-2">
        <div className="flex items-center gap-1.5">
          <Users className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">People You May Know</h2>
        </div>
        <button
          onClick={() => navigate("/people-suggestions")}
          className="flex items-center gap-0.5 text-xs text-primary font-medium hover:underline"
        >
          See All
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Horizontal scroll */}
      <div
        ref={scrollRef}
        className="flex gap-2.5 overflow-x-auto scrollbar-hide px-2 sm:px-0 pb-1"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {users.slice(0, 6).map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="flex-shrink-0 w-[130px] bg-card border border-border rounded-xl p-3 flex flex-col items-center gap-1.5 relative"
          >
            <button
              onClick={() => handleRemove(user.id)}
              className="absolute top-1.5 right-1.5 p-0.5 rounded-full hover:bg-muted transition-colors"
            >
              <X className="w-3 h-3 text-muted-foreground" />
            </button>
            <Avatar className="w-12 h-12">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <p className="text-xs font-medium text-foreground text-center truncate w-full">{user.name}</p>
            <p className="text-[10px] text-muted-foreground">{user.mutualFriends} mutual</p>
            <Button
              size="sm"
              variant={following.has(user.id) ? "secondary" : "default"}
              className="w-full h-7 text-[11px] rounded-lg"
              onClick={() => handleFollow(user.id, user.name)}
            >
              {following.has(user.id) ? "Following" : "Follow"}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PeopleYouMayKnow;
