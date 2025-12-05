import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageCircle, Instagram, Mail, FileText, Share2 } from "lucide-react";

interface ShareSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShareSheet = ({ isOpen, onClose }: ShareSheetProps) => {
  const shareOptions = [
    { icon: MessageCircle, label: "WhatsApp", color: "bg-green-500", onClick: () => window.open("https://wa.me/?text=Check%20this%20out!", "_blank") },
    { icon: Instagram, label: "Instagram", color: "bg-gradient-to-r from-purple-500 to-pink-500", onClick: () => console.log("Share to Instagram") },
    { icon: Mail, label: "Email", color: "bg-red-500", onClick: () => window.open("mailto:?subject=Check%20this%20out!", "_blank") },
    { icon: FileText, label: "Notes", color: "bg-yellow-500", onClick: () => console.log("Save to Notes") },
    { icon: Share2, label: "More", color: "bg-muted", onClick: () => navigator.share?.({ title: "Check this out!", url: window.location.href }) },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xs sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center">Share</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-4 gap-4 py-4">
          {shareOptions.map((option) => (
            <button
              key={option.label}
              onClick={() => {
                option.onClick();
                onClose();
              }}
              className="flex flex-col items-center gap-2"
            >
              <div className={`w-12 h-12 rounded-full ${option.color} flex items-center justify-center text-white`}>
                <option.icon className="w-5 h-5" />
              </div>
              <span className="text-xs text-muted-foreground">{option.label}</span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareSheet;
