import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const initialStories = [
  { id: 1, name: "Your Story", image: null as string | null, isAdd: true },
  { id: 2, name: "Sarah", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
  { id: 3, name: "Mike", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike" },
  { id: 4, name: "Emma", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma" },
  { id: 5, name: "Jake", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jake" },
  { id: 6, name: "Olivia", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia" },
];

const Stories = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stories, setStories] = useState(initialStories);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewIsVideo, setPreviewIsVideo] = useState(false);
  const [viewStory, setViewStory] = useState<{ name: string; image: string | null } | null>(null);

  const handleYourStoryClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewIsVideo(file.type.startsWith("video/"));
      setPreviewUrl(URL.createObjectURL(file));
    }
    e.target.value = "";
  };

  const closePreview = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  const handleShareStory = () => {
    if (!previewUrl) return;
    setStories((prev) =>
      prev.map((s) => (s.isAdd ? { ...s, image: previewIsVideo ? s.image : previewUrl } : s))
    );
    setPreviewUrl(null);
    toast({ title: "Story shared", description: "Your story is now live for 24 hours." });
  };

  const storiesContainerRef = useRef<HTMLDivElement>(null);

  // Mark touch events originating from stories to prevent page navigation
  useEffect(() => {
    const el = storiesContainerRef.current;
    if (!el) return;

    const markEvent = (e: TouchEvent) => {
      (e as any).__storySwipe = true;
    };

    el.addEventListener('touchstart', markEvent, { passive: true });
    el.addEventListener('touchend', markEvent, { passive: true });
    el.addEventListener('touchmove', markEvent, { passive: true });

    return () => {
      el.removeEventListener('touchstart', markEvent);
      el.removeEventListener('touchend', markEvent);
      el.removeEventListener('touchmove', markEvent);
    };
  }, []);

  return (
    <div
      ref={storiesContainerRef}
      className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide"
    >
      {/* Hidden file input for Your Story */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {stories.map((story, index) => (
        <motion.div
          key={story.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-shrink-0 cursor-pointer"
          onClick={
            story.isAdd
              ? story.image
                ? () => setViewStory({ name: "Your Story", image: story.image })
                : handleYourStoryClick
              : () => setViewStory({ name: story.name, image: story.image ?? null })
          }
        >
          <div className="relative">
            {story.isAdd && !story.image ? (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center glow-effect">
                <Plus className="w-8 h-8 text-primary-foreground" />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full p-[3px] bg-gradient-to-br from-primary to-primary-glow glow-effect">
                <Avatar className="w-full h-full border-4 border-background">
                  <AvatarImage src={story.image || undefined} className="object-cover" />
                  <AvatarFallback>{story.name[0]}</AvatarFallback>
                </Avatar>
              </div>
            )}
            {story.isAdd && story.image && (
              <button
                onClick={(e) => { e.stopPropagation(); handleYourStoryClick(); }}
                aria-label="Add to your story"
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center border-2 border-background"
              >
                <Plus className="w-3.5 h-3.5 text-primary-foreground" />
              </button>
            )}
          </div>
          <p className="text-xs text-center mt-2 text-foreground font-medium truncate w-20">
            {story.name}
          </p>
        </motion.div>
      ))}

      {/* Story upload preview */}
      <Dialog open={!!previewUrl} onOpenChange={(open) => !open && closePreview()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Share to your story</DialogTitle>
          </DialogHeader>
          {previewUrl && (
            <div className="rounded-xl overflow-hidden bg-muted max-h-[55vh] flex items-center justify-center">
              {previewIsVideo ? (
                <video src={previewUrl} controls className="w-full max-h-[55vh]" />
              ) : (
                <img src={previewUrl} alt="Story preview" className="w-full max-h-[55vh] object-contain" />
              )}
            </div>
          )}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 h-11" onClick={closePreview}>
              Discard
            </Button>
            <Button className="flex-1 h-11" onClick={handleShareStory}>
              Share Story
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Story viewer */}
      <Dialog open={!!viewStory} onOpenChange={(open) => !open && setViewStory(null)}>
        <DialogContent className="max-w-sm p-0 overflow-hidden">
          <DialogHeader className="p-4 pb-2">
            <DialogTitle className="text-base">{viewStory?.name}</DialogTitle>
          </DialogHeader>
          <div className="bg-muted flex items-center justify-center min-h-[280px]">
            {viewStory?.image ? (
              <img src={viewStory.image} alt={`${viewStory.name} story`} className="w-full max-h-[60vh] object-contain" />
            ) : (
              <p className="text-sm text-muted-foreground p-8">No story available</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Stories;
