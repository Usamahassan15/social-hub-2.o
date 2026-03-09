import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2, Flag, AlertTriangle, Shield } from "lucide-react";

interface ReportContentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  reportedUserId?: string;
  reportedContentId?: string;
  contentType?: "post" | "comment" | "message" | "profile";
}

const REPORT_REASONS = [
  { value: "spam", label: "Spam", description: "Repetitive or promotional content" },
  { value: "harassment", label: "Harassment", description: "Bullying or targeted attacks" },
  { value: "scam", label: "Scam / Fraud", description: "Fake investments, phishing, etc." },
  { value: "adult_content", label: "Adult Content", description: "Nudity or sexual content" },
  { value: "fake_account", label: "Fake Account", description: "Impersonation or bot account" },
  { value: "hate_speech", label: "Hate Speech", description: "Discriminatory or hateful content" },
  { value: "violence", label: "Violence", description: "Threats or violent content" },
  { value: "copyright", label: "Copyright", description: "Stolen content or plagiarism" },
  { value: "other", label: "Other", description: "Other violations" },
] as const;

const ReportContentDialog = ({
  isOpen,
  onClose,
  reportedUserId,
  reportedContentId,
  contentType = "post",
}: ReportContentDialogProps) => {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [description, setDescription] = useState("");
  const [evidenceUrl, setEvidenceUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!selectedReason) {
      toast({
        variant: "destructive",
        title: "Please select a reason",
        description: "Select why you're reporting this content.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          variant: "destructive",
          title: "Please log in",
          description: "You need to be logged in to report content.",
        });
        return;
      }

      const { error } = await supabase.from("user_reports").insert({
        reporter_id: session.user.id,
        reported_user_id: reportedUserId || null,
        reported_content_id: reportedContentId || null,
        report_reason: selectedReason as any,
        description: description.trim() || null,
        evidence_url: evidenceUrl.trim() || null,
      });

      if (error) throw error;

      setSubmitted(true);
      toast({
        title: "Report Submitted",
        description: "Thank you for helping keep our community safe. We'll review this report shortly.",
      });

      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      console.error("Report submission error:", error);
      toast({
        variant: "destructive",
        title: "Failed to submit report",
        description: "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedReason("");
    setDescription("");
    setEvidenceUrl("");
    setSubmitted(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
              <Flag className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <DialogTitle>Report {contentType}</DialogTitle>
              <DialogDescription>
                Help us keep the community safe
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
              <Shield className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Report Submitted</h3>
            <p className="text-sm text-muted-foreground">
              Our moderation team will review this report and take appropriate action.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Why are you reporting this?</Label>
              <RadioGroup value={selectedReason} onValueChange={setSelectedReason}>
                {REPORT_REASONS.map((reason) => (
                  <div
                    key={reason.value}
                    className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                      selectedReason === reason.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-muted/50"
                    }`}
                    onClick={() => setSelectedReason(reason.value)}
                  >
                    <RadioGroupItem value={reason.value} id={reason.value} className="mt-0.5" />
                    <div className="flex-1">
                      <Label htmlFor={reason.value} className="font-medium cursor-pointer">
                        {reason.label}
                      </Label>
                      <p className="text-xs text-muted-foreground">{reason.description}</p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Additional details (optional)</Label>
              <Textarea
                id="description"
                placeholder="Provide more context about why you're reporting this..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[80px] resize-none"
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground text-right">{description.length}/500</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="evidence">Evidence URL (optional)</Label>
              <Input
                id="evidence"
                placeholder="Link to screenshot or additional evidence"
                value={evidenceUrl}
                onChange={(e) => setEvidenceUrl(e.target.value)}
              />
            </div>

            <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
              <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground">
                False reports may result in action against your account. Only report content that genuinely violates our community guidelines.
              </p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                className="flex-1 bg-destructive hover:bg-destructive/90"
                onClick={handleSubmit}
                disabled={isSubmitting || !selectedReason}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Report"
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReportContentDialog;
