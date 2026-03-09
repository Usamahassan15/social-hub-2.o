import { Image, Video, Smile, X, FileText, BarChart3, UserX, MessageSquare, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useContentModeration } from "@/hooks/use-content-moderation";
import ModerationWarningDialog from "./ModerationWarningDialog";
import { toast } from "@/hooks/use-toast";

interface CreatePostProps {
  isOpen: boolean;
  onClose: () => void;
}

const postTypes = [
  { id: "text", icon: FileText, label: "Text Post", description: "Share your thoughts" },
  { id: "photo", icon: Image, label: "Photo Post", description: "Share images" },
  { id: "video", icon: Video, label: "Video Post", description: "Share videos" },
  { id: "poll", icon: BarChart3, label: "Create Poll", description: "Ask a question" },
  { id: "anonymous", icon: UserX, label: "Anonymous Post", description: "Post anonymously" },
  { id: "feeling", icon: MessageSquare, label: "Feeling/Activity", description: "Share how you feel" },
];

const CreatePost = ({ isOpen, onClose }: CreatePostProps) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [postContent, setPostContent] = useState("");
  const [showModerationWarning, setShowModerationWarning] = useState(false);
  const [moderationData, setModerationData] = useState<any>(null);
  const { moderateText, moderateImage, isChecking } = useContentModeration();

  const handleBack = () => {
    setSelectedType(null);
  };

  const handleClose = () => {
    setSelectedType(null);
    setPostContent("");
    onClose();
  };

  const handlePost = async () => {
    if (!postContent.trim()) return;
    
    const result = await moderateText(postContent, selectedType || "text");
    
    if (!result.allowed) {
      setModerationData(result);
      setShowModerationWarning(true);
      return;
    }
    
    toast({ title: "Post published!" });
    handleClose();
  };

  return (
    <>
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-lg mx-auto max-h-[85vh] overflow-y-auto rounded-lg">
        <DialogHeader>
          <DialogTitle>
            {selectedType ? (
              <Button variant="ghost" size="sm" onClick={handleBack} className="text-sm -ml-2">
                ← Back
              </Button>
            ) : (
              "Create Post"
            )}
          </DialogTitle>
        </DialogHeader>

        {!selectedType ? (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground mb-3">Choose post type:</p>
            {postTypes.map((type) => (
              <Button
                key={type.id}
                variant="outline"
                className="w-full justify-start gap-3 h-14 hover:bg-muted/50"
                onClick={() => setSelectedType(type.id)}
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <type.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">{type.label}</p>
                  <p className="text-xs text-muted-foreground">{type.description}</p>
                </div>
              </Button>
            ))}
          </div>
        ) : (
          <>
            <div className="flex items-start gap-3 mb-4">
              <Avatar>
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=You" />
                <AvatarFallback>You</AvatarFallback>
              </Avatar>
              <Textarea
                placeholder="What's on your mind?"
                className="min-h-32 resize-none"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 mb-4 p-3 rounded-lg border border-border">
              <span className="text-sm font-medium text-foreground">Add to post:</span>
              <Button variant="ghost" size="icon" className="text-primary">
                <Image className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary">
                <Video className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary">
                <Smile className="w-5 h-5" />
              </Button>
            </div>

            <Button
              className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:opacity-90"
              onClick={handlePost}
              disabled={isChecking || !postContent.trim()}
            >
              {isChecking ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Checking content...
                </>
              ) : (
                "Post"
              )}
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
    
    <ModerationWarningDialog
      isOpen={showModerationWarning}
      onClose={() => setShowModerationWarning(false)}
      warningNumber={moderationData?.warning_number}
      isBanned={moderationData?.is_banned}
      banDurationHours={moderationData?.ban_duration_hours}
      banEndsAt={moderationData?.ban_ends_at}
      message={moderationData?.message}
    />
  );
};

export default CreatePost;
