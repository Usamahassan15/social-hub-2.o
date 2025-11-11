import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { toast } from "sonner";

interface InviteFriendsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const InviteFriendsDialog = ({ isOpen, onClose }: InviteFriendsDialogProps) => {
  const shareOptions = [
    { name: "WhatsApp", color: "bg-green-500", icon: "💬" },
    { name: "Facebook", color: "bg-blue-600", icon: "📘" },
    { name: "Instagram", color: "bg-pink-500", icon: "📸" },
    { name: "Twitter", color: "bg-sky-500", icon: "🐦" },
    { name: "Copy Link", color: "bg-muted", icon: "🔗" },
  ];

  const handleShare = async (platform: string) => {
    const inviteLink = window.location.origin;
    const message = `Join me on SocialApp! ${inviteLink}`;

    if (platform === "Copy Link") {
      try {
        await navigator.clipboard.writeText(inviteLink);
        toast.success("Link copied to clipboard!");
      } catch (err) {
        toast.error("Failed to copy link");
      }
      return;
    }

    // Check if Web Share API is available
    if (navigator.share && platform !== "Copy Link") {
      try {
        await navigator.share({
          title: "Join SocialApp",
          text: message,
          url: inviteLink,
        });
        toast.success(`Shared via ${platform}`);
      } catch (err) {
        console.log("Share cancelled or failed");
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(message);
        toast.success("Invite link copied to clipboard!");
      } catch (err) {
        toast.error("Failed to copy link");
      }
    }
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Invite Friends
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 mt-4">
          <p className="text-sm text-muted-foreground mb-4">
            Share SocialApp with your friends
          </p>
          
          {shareOptions.map((option) => (
            <Button
              key={option.name}
              variant="outline"
              className="w-full justify-start gap-3 h-12"
              onClick={() => handleShare(option.name)}
            >
              <div className={`w-8 h-8 rounded-full ${option.color} flex items-center justify-center text-lg`}>
                {option.icon}
              </div>
              <span>{option.name}</span>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteFriendsDialog;
