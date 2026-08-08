import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface InterestsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const INTERESTS = [
  "Technology", "Travel", "Food", "Fitness", "Music", "Movies",
  "Photography", "Gaming", "Business", "Fashion", "Art", "Sports",
  "Education", "Health", "Pets", "Cars",
];

const InterestsDialog = ({ isOpen, onClose }: InterestsDialogProps) => {
  const [selected, setSelected] = useState<string[]>(["Technology", "Travel", "Music"]);

  const toggle = (item: string) => {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleSave = () => {
    toast({ title: "Interests updated", description: `${selected.length} interests selected` });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>My Interests</DialogTitle>
          <DialogDescription>Pick topics you want to see more of in your feed.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap gap-2 py-2">
          {INTERESTS.map((item) => {
            const active = selected.includes(item);
            return (
              <button
                key={item}
                onClick={() => toggle(item)}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:bg-muted"
                }`}
              >
                {active && <Check className="w-3.5 h-3.5" />}
                {item}
              </button>
            );
          })}
        </div>

        <Button className="w-full h-11" onClick={handleSave} disabled={selected.length === 0}>
          Save Interests
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default InterestsDialog;
