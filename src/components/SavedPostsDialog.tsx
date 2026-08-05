import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bookmark } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

interface SavedPostsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const SavedPostsDialog = ({ isOpen, onClose }: SavedPostsDialogProps) => {
  // This would normally come from a context or state management
  const savedPosts: any[] = [];

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
            <div className="space-y-4">
              {savedPosts.map((post) => (
                <div key={post.id} className="p-4 border rounded-lg">
                  {/* Saved post content would go here */}
                  <p>{post.content}</p>
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
