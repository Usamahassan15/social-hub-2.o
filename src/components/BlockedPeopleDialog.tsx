import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";

interface BlockedPeopleDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const initialBlockedUsers = [
  { id: 1, name: "John Smith", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John" },
  { id: 2, name: "Jane Doe", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane" },
];

const BlockedPeopleDialog = ({ isOpen, onClose }: BlockedPeopleDialogProps) => {
  const [blockedUsers, setBlockedUsers] = useState(initialBlockedUsers);

  const handleUnblock = (userId: number, userName: string) => {
    setBlockedUsers(prev => prev.filter(user => user.id !== userId));
    toast({ title: `${userName} has been unblocked` });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Blocked People</DialogTitle>
          <DialogDescription>People you've blocked can't see your posts or contact you.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-4 max-h-80 overflow-y-auto">
          {blockedUsers.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">You haven't blocked anyone yet.</p>
          ) : (
            blockedUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-sm">{user.name}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUnblock(user.id, user.name)}
                >
                  Unblock
                </Button>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlockedPeopleDialog;
