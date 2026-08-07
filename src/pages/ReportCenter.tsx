import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import TopBar from "@/components/TopBar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SuccessState } from "@/components/ui/success-state";
import {
  User,
  FileText,
  Briefcase,
  Car,
  ChevronRight,
  ChevronLeft,
  Paperclip,
  X,
  Loader2,
} from "lucide-react";

type TargetType = "user" | "post" | "service" | "ride";
type Step = "select-target" | "select-reason" | "details" | "success";

const targets: { id: TargetType; label: string; icon: typeof User; description: string }[] = [
  { id: "user", label: "Report User", icon: User, description: "Report a person's profile or behavior" },
  { id: "post", label: "Report Post", icon: FileText, description: "Report inappropriate content in a post" },
  { id: "service", label: "Report Service", icon: Briefcase, description: "Report an issue with a listed service" },
  { id: "ride", label: "Report Ride", icon: Car, description: "Report a problem with a ride" },
];

const reasons = [
  "Spam",
  "Harassment",
  "Scam/Fraud",
  "Inappropriate Content",
  "Fake Account",
  "Dangerous Activity",
  "Other",
];

export default function ReportCenter() {
  const [step, setStep] = useState<Step>("select-target");
  const [target, setTarget] = useState<TargetType | null>(null);
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const targetLabel = targets.find((t) => t.id === target)?.label ?? "Report";

  const reset = () => {
    setStep("select-target");
    setTarget(null);
    setReason("");
    setDescription("");
    setFileName(null);
    setLoading(false);
  };

  const handleSelectTarget = (id: TargetType) => {
    setTarget(id);
    setStep("select-reason");
  };

  const handleSelectReason = () => {
    if (!reason) return;
    setStep("details");
  };

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("success");
    }, 1200);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <TopBar />

      <main className="flex-1 md:ml-64 pb-20 sm:pb-24 md:pb-8 pt-14 md:pt-14">
        <div className="max-w-2xl lg:max-w-3xl mx-auto lg:-translate-x-32 px-3 sm:px-4 md:px-6 lg:px-8 pt-4 sm:pt-5 md:pt-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 sm:mb-7 md:mb-8"
          >
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-1 sm:mb-2">
              Report Center
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">Report an issue to keep the community safe</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {step === "select-target" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {targets.map((t) => (
                  <Card
                    key={t.id}
                    className="cursor-pointer hover:shadow-md transition-all"
                    onClick={() => handleSelectTarget(t.id)}
                  >
                    <CardContent className="p-4 sm:p-5 flex items-center gap-3">
                      <div className="rounded-full bg-primary/10 p-2.5">
                        <t.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm sm:text-base text-foreground">{t.label}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">{t.description}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {step === "select-reason" && (
              <Card>
                <CardHeader className="pb-3 sm:pb-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-fit -ml-2 mb-1 gap-1 text-muted-foreground"
                    onClick={() => setStep("select-target")}
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </Button>
                  <CardTitle className="text-base sm:text-lg">{targetLabel}</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Select a reason for this report</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup value={reason} onValueChange={setReason} className="space-y-2">
                    {reasons.map((r) => (
                      <div
                        key={r}
                        className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-muted/50 transition-colors"
                      >
                        <RadioGroupItem value={r} id={r} />
                        <Label htmlFor={r} className="flex-1 cursor-pointer text-sm sm:text-base">
                          {r}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  <Button className="w-full h-11" disabled={!reason} onClick={handleSelectReason}>
                    Continue
                  </Button>
                </CardContent>
              </Card>
            )}

            {step === "details" && (
              <Card>
                <CardHeader className="pb-3 sm:pb-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-fit -ml-2 mb-1 gap-1 text-muted-foreground"
                    onClick={() => setStep("select-reason")}
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </Button>
                  <CardTitle className="text-base sm:text-lg">Additional Details</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    {targetLabel} · {reason}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (optional)</Label>
                    <Textarea
                      id="description"
                      placeholder="Provide more context about this report..."
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Attachment (optional)</Label>
                    {fileName ? (
                      <div className="flex items-center justify-between rounded-lg border border-border p-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <Paperclip className="w-4 h-4 text-muted-foreground shrink-0" />
                          <span className="text-sm text-foreground truncate">{fileName}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => {
                            setFileName(null);
                            if (fileInputRef.current) fileInputRef.current.value = "";
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full gap-2"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Paperclip className="w-4 h-4" /> Attach a file
                      </Button>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                  <Button className="w-full h-11" onClick={handleSubmit} disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...
                      </>
                    ) : (
                      "Submit Report"
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {step === "success" && (
              <Card>
                <CardContent className="pt-6">
                  <SuccessState
                    title="Report Submitted"
                    description="Thank you for helping keep our community safe. Our team will review your report shortly."
                    primaryLabel="Done"
                    onPrimary={reset}
                  />
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
