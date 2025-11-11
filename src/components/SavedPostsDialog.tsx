import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bookmark } from "lucide-react";

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
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bookmark className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No saved posts yet</h3>
              <p className="text-sm text-muted-foreground">
                Posts you save will appear here
              </p>
            </div>
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
