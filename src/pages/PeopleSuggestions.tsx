import { ArrowLeft, Users, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { suggestedUsers } from "@/components/PeopleYouMayKnow";

const PeopleSuggestions = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState(suggestedUsers);
  const [following, setFollowing] = useState<Set<number>>(new Set());

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="flex items-center gap-3 h-14 px-4">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex items-center gap-1.5">
            <Users className="w-5 h-5 text-primary" />
            <h1 className="text-base font-semibold text-foreground">People You May Know</h1>
          </div>
        </div>
      </header>

      {/* User Grid - 2 columns on mobile */}
      <div className="max-w-lg mx-auto px-3 py-4">
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          {users.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="bg-card border border-border rounded-xl p-3 flex flex-col items-center gap-2 relative"
            >
              <button
                onClick={() => handleRemove(user.id)}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
              <div
                className="flex flex-col items-center gap-1.5 cursor-pointer w-full"
                onClick={() => navigate(`/user/${user.id}`)}
              >
                <Avatar className="w-16 h-16">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <p className="text-xs font-medium text-foreground text-center truncate w-full">{user.name}</p>
                <p className="text-[10px] text-muted-foreground">{user.mutualFriends} mutual friends</p>
              </div>
              <Button
                size="sm"
                variant={following.has(user.id) ? "secondary" : "default"}
                className="w-full h-8 text-xs rounded-lg"
                onClick={() => handleFollow(user.id, user.name)}
              >
                {following.has(user.id) ? "Following" : "Follow"}
              </Button>
            </motion.div>
          ))}
        </div>
        {users.length === 0 && (
          <p className="text-center text-muted-foreground text-sm py-12">No more suggestions</p>
        )}
      </div>
    </div>
  );
};

export default PeopleSuggestions;
