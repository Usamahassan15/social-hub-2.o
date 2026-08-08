import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bookmark, Heart, MessageCircle } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { savedPostsMock } from "@/lib/savedPosts";

interface SavedPostsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const SavedPostsDialog = ({ isOpen, onClose }: SavedPostsDialogProps) => {
  const savedPosts = savedPostsMock;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bookmark className="w-5 h-5" />
            Saved Posts
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-full max-h-[60vh]">
          {savedPosts.length === 0 ? (
            <EmptyState
              icon={Bookmark}
              title="No saved posts yet"
              description="Posts you save will appear here for quick access later."
            />
          ) : (
            <div className="space-y-4 pr-1">
              {savedPosts.map((post) => (
                <div key={post.id} className="p-3 sm:p-4 border border-border rounded-lg bg-card">
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="w-9 h-9">
                      <AvatarImage src={post.avatar} />
                      <AvatarFallback>{post.author[0]}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{post.author}</p>
                      <p className="text-xs text-muted-foreground">{post.time}</p>
                    </div>
                  </div>
                  <p className="text-sm text-foreground">{post.content}</p>
                  {post.image && (
                    <img
                      src={post.image}
                      alt={`Saved post by ${post.author}`}
                      loading="lazy"
                      className="mt-3 w-full rounded-lg object-cover max-h-56"
                    />
                  )}
                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> {post.likes}</span>
                    <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" /> {post.comments}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default SavedPostsDialog;
