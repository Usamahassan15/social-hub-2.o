import { Image, Video, Smile, X, FileText, BarChart3, UserX, MessageSquare, Loader2, MapPin, Hash, AtSign, Globe, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const MOCK_USERS = [
  { id: "1", name: "Sarah Chen", handle: "sarahchen" },
  { id: "2", name: "Marcus Lee", handle: "marcuslee" },
  { id: "3", name: "Priya Patel", handle: "priyapatel" },
  { id: "4", name: "Alex Johnson", handle: "alexjohnson" },
  { id: "5", name: "Jordan Kim", handle: "jordankim" },
];

interface ImageItem {
  file: File;
  url: string;
}

const CreatePost = ({ isOpen, onClose }: CreatePostProps) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [postContent, setPostContent] = useState("");
  const [showModerationWarning, setShowModerationWarning] = useState(false);
  const [moderationData, setModerationData] = useState<any>(null);
  const { moderateText, moderateImage, isChecking } = useContentModeration();

  // New composer state
  const [images, setImages] = useState<ImageItem[]>([]);
  const [location, setLocation] = useState("");
  const [hashtagInput, setHashtagInput] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [mentionInput, setMentionInput] = useState("");
  const [mentions, setMentions] = useState<typeof MOCK_USERS>([]);
  const [showMentionSuggestions, setShowMentionSuggestions] = useState(false);
  const [audience, setAudience] = useState<"public" | "followers">("public");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBack = () => {
    setSelectedType(null);
  };

  const resetComposer = () => {
    images.forEach((img) => URL.revokeObjectURL(img.url));
    setImages([]);
    setLocation("");
    setHashtagInput("");
    setHashtags([]);
    setMentionInput("");
    setMentions([]);
    setShowMentionSuggestions(false);
    setAudience("public");
  };

  const handleClose = () => {
    setSelectedType(null);
    setPostContent("");
    resetComposer();
    onClose();
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length) {
      const newImages = files.map((file) => ({ file, url: URL.createObjectURL(file) }));
      setImages((prev) => [...prev, ...newImages]);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const target = prev[index];
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleHashtagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "," || e.key === " ") {
      e.preventDefault();
      commitHashtagInput();
    } else if (e.key === "Backspace" && !hashtagInput && hashtags.length) {
      setHashtags((prev) => prev.slice(0, -1));
    }
  };

  const commitHashtagInput = () => {
    const parts = hashtagInput
      .split(/[\s,]+/)
      .map((p) => p.replace(/^#/, "").trim())
      .filter(Boolean);
    if (parts.length) {
      setHashtags((prev) => Array.from(new Set([...prev, ...parts])));
    }
    setHashtagInput("");
  };

  const removeHashtag = (tag: string) => {
    setHashtags((prev) => prev.filter((t) => t !== tag));
  };

  const mentionSuggestions = MOCK_USERS.filter(
    (u) =>
      mentionInput.trim().length > 0 &&
      !mentions.some((m) => m.id === u.id) &&
      (u.name.toLowerCase().includes(mentionInput.toLowerCase()) ||
        u.handle.toLowerCase().includes(mentionInput.toLowerCase()))
  );

  const addMention = (user: (typeof MOCK_USERS)[number]) => {
    setMentions((prev) => [...prev, user]);
    setMentionInput("");
    setShowMentionSuggestions(false);
  };

  const removeMention = (id: string) => {
    setMentions((prev) => prev.filter((m) => m.id !== id));
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

            {/* Image previews */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-4">
                {images.map((img, index) => (
                  <div key={img.url} className="relative aspect-square rounded-lg overflow-hidden bg-muted group">
                    <img src={img.url} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 mb-4 p-3 rounded-lg border border-border">
              <span className="text-sm font-medium text-foreground">Add to post:</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageSelect}
              />
              <Button variant="ghost" size="icon" className="text-primary" onClick={() => fileInputRef.current?.click()}>
                <Image className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary">
                <Video className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary">
                <Smile className="w-5 h-5" />
              </Button>
            </div>

            {/* Location */}
            <div className="relative mb-3">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Add location (optional)"
                className="pl-9"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            {/* Hashtags */}
            <div className="mb-3">
              <div className="relative mb-2">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Add hashtags (comma or space separated)"
                  className="pl-9"
                  value={hashtagInput}
                  onChange={(e) => setHashtagInput(e.target.value)}
                  onKeyDown={handleHashtagKeyDown}
                  onBlur={commitHashtagInput}
                />
              </div>
              {hashtags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {hashtags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      #{tag}
                      <button type="button" onClick={() => removeHashtag(tag)}>
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Mentions */}
            <div className="mb-4 relative">
              <div className="relative">
                <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Mention people"
                  className="pl-9"
                  value={mentionInput}
                  onChange={(e) => { setMentionInput(e.target.value); setShowMentionSuggestions(true); }}
                  onFocus={() => setShowMentionSuggestions(true)}
                />
              </div>
              {showMentionSuggestions && mentionSuggestions.length > 0 && (
                <div className="absolute z-10 mt-1 w-full rounded-md border border-border bg-popover shadow-md overflow-hidden">
                  {mentionSuggestions.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors text-left"
                      onClick={() => addMention(user)}
                    >
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-foreground">{user.name}</span>
                      <span className="text-muted-foreground">@{user.handle}</span>
                    </button>
                  ))}
                </div>
              )}
              {mentions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {mentions.map((user) => (
                    <Badge key={user.id} variant="outline" className="gap-1">
                      @{user.handle}
                      <button type="button" onClick={() => removeMention(user.id)}>
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Audience selector */}
            <div className="mb-4">
              <Select value={audience} onValueChange={(v) => setAudience(v as "public" | "followers")}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">
                    <span className="flex items-center gap-2"><Globe className="w-4 h-4" /> Public</span>
                  </SelectItem>
                  <SelectItem value="followers">
                    <span className="flex items-center gap-2"><Users className="w-4 h-4" /> Followers</span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 h-12"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 h-12 bg-gradient-to-r from-primary to-primary/80 hover:opacity-90"
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
            </div>
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
    </>
  );
};

export default CreatePost;
