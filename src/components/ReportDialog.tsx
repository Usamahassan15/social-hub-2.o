import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Upload, Link, ChevronLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  type?: "post" | "user" | "comment";
}

const contentReasons = [
  "Offensive / Abusive",
  "Fake / Misleading",
  "Spam / Scam",
  "Harassment / Hate Speech",
  "Explicit / Adult Content",
  "Violence / Terrorism",
  "Copyright Violation",
];

const userReasons = [
  "Fake Profile",
  "Impersonation",
  "Stolen Identity",
  "Bullying / Harassment",
  "Spam / Bot",
];

const commentReasons = [
  "Threatening",
  "Blackmail",
  "Hate Speech",
  "Scam",
  "Sexual Harassment",
];

const ReportDialog = ({ isOpen, onClose, type = "post" }: ReportDialogProps) => {
  const [step, setStep] = useState(1);
  const [selectedReason, setSelectedReason] = useState("");
  const [details, setDetails] = useState("");
  const [link, setLink] = useState("");

  const reasons = type === "user" ? userReasons : type === "comment" ? commentReasons : contentReasons;

  const handleSubmit = () => {
    if (!selectedReason) {
      toast({ title: "Please select a reason", variant: "destructive" });
      return;
    }
    console.log("Report submitted:", { type, reason: selectedReason, details, link });
    toast({ title: "Report submitted", description: "Thank you for helping keep our community safe." });
    handleClose();
  };

  const handleClose = () => {
    setStep(1);
    setSelectedReason("");
    setDetails("");
    setLink("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {step > 1 && (
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setStep(step - 1)}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
            )}
            <div>
              <DialogTitle>Report {type === "user" ? "User" : type === "comment" ? "Comment" : "Content"}</DialogTitle>
              <DialogDescription>
                {step === 1 ? "Select a reason for your report" : "Add additional details"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4 py-4">
            <RadioGroup value={selectedReason} onValueChange={setSelectedReason}>
              {reasons.map((reason) => (
                <div key={reason} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors">
                  <RadioGroupItem value={reason} id={reason} />
                  <Label htmlFor={reason} className="flex-1 cursor-pointer text-sm">{reason}</Label>
                </div>
              ))}
            </RadioGroup>
            <Button className="w-full" onClick={() => setStep(2)} disabled={!selectedReason}>
              Continue
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 py-4">
            <div className="p-3 bg-muted rounded-lg">
              <span className="text-sm text-muted-foreground">Reason:</span>
              <p className="font-medium text-sm">{selectedReason}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="details">Additional Details (optional)</Label>
              <Textarea
                id="details"
                placeholder="Provide more context about this report..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={3}
                className="text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="link">Add Link (optional)</Label>
              <div className="relative">
                <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="link"
                  placeholder="https://..."
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="pl-10 text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Upload Screenshot (optional)</Label>
              <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted transition-colors">
                <Upload className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Click to upload</span>
                <input type="file" accept="image/*" className="hidden" />
              </label>
            </div>

            <Button className="w-full" onClick={handleSubmit}>
              Submit Report
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReportDialog;
