import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import TopBar from "@/components/TopBar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  ShieldCheck,
  ShieldOff,
  Smartphone,
  MessageSquare,
  Loader2,
  ChevronLeft,
  Copy,
  Download,
  RefreshCw,
  KeyRound,
} from "lucide-react";

type Method = "app" | "sms";
type Step = "intro" | "choose-method" | "verify" | "confirmed";

function generateBackupCodes() {
  return Array.from({ length: 10 }, () =>
    Math.random().toString(36).slice(2, 6).toUpperCase() + "-" + Math.random().toString(36).slice(2, 6).toUpperCase()
  );
}

export default function TwoFactor() {
  const { toast } = useToast();
  const [enabled, setEnabled] = useState(false);
  const [step, setStep] = useState<Step>("intro");
  const [method, setMethod] = useState<Method | null>(null);
  const [code, setCode] = useState("");
  const [verifyError, setVerifyError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);

  const [disableOpen, setDisableOpen] = useState(false);
  const [disableCode, setDisableCode] = useState("");
  const [disableError, setDisableError] = useState("");

  const [regenerating, setRegenerating] = useState(false);

  const backupCodesText = useMemo(() => backupCodes.join("\n"), [backupCodes]);

  const resetFlow = () => {
    setStep("intro");
    setMethod(null);
    setCode("");
    setVerifyError("");
    setVerifying(false);
  };

  const handleEnableClick = () => setStep("choose-method");

  const handleChooseMethod = (m: Method) => {
    setMethod(m);
    setStep("verify");
    setCode("");
    setVerifyError("");
  };

  const handleVerify = () => {
    if (code.length < 6) {
      setVerifyError("Please enter the full 6-digit code");
      return;
    }
    setVerifyError("");
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setBackupCodes(generateBackupCodes());
      setEnabled(true);
      setStep("confirmed");
      toast({ title: "Two-Factor Authentication Enabled", description: "Your account is now more secure." });
    }, 1000);
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(backupCodesText);
    toast({ title: "Backup codes copied to clipboard" });
  };

  const handleDownload = () => {
    const blob = new Blob([backupCodesText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "backup-codes.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast({ title: "Backup codes downloaded" });
  };

  const handleRegenerate = () => {
    setRegenerating(true);
    setTimeout(() => {
      setBackupCodes(generateBackupCodes());
      setRegenerating(false);
      toast({ title: "Backup codes regenerated" });
    }, 800);
  };

  const handleDisableConfirm = () => {
    if (disableCode.length < 6) {
      setDisableError("Please enter the full 6-digit code");
      return;
    }
    setDisableError("");
    setEnabled(false);
    setDisableOpen(false);
    setDisableCode("");
    resetFlow();
    toast({ title: "Two-Factor Authentication Disabled", description: "2FA has been turned off for your account." });
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
              Two-Factor Authentication
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">Add an extra layer of security to your account</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4 sm:space-y-5 md:space-y-6"
          >
            {enabled ? (
              <>
                <Card>
                  <CardHeader className="pb-3 sm:pb-6">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-primary" />
                        <CardTitle className="text-base sm:text-lg">2FA is Enabled</CardTitle>
                      </div>
                      <Badge className="bg-primary/10 text-primary border-primary/20">Active</Badge>
                    </div>
                    <CardDescription className="text-xs sm:text-sm">
                      Your account is protected with {method === "sms" ? "SMS" : "Authenticator App"} verification.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AlertDialog open={disableOpen} onOpenChange={(o) => { setDisableOpen(o); if (!o) { setDisableCode(""); setDisableError(""); } }}>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="gap-2 w-full sm:w-auto">
                          <ShieldOff className="w-4 h-4" /> Disable 2FA
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Disable Two-Factor Authentication</AlertDialogTitle>
                          <AlertDialogDescription>
                            Enter your 6-digit verification code to confirm disabling 2FA. This will make your account less secure.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="py-2 flex flex-col items-center gap-2">
                          <InputOTP maxLength={6} value={disableCode} onChange={setDisableCode}>
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                          {disableError && <p className="text-sm text-destructive">{disableError}</p>}
                        </div>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={(e) => { e.preventDefault(); handleDisableConfirm(); }}>
                            Confirm Disable
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3 sm:pb-6">
                    <div className="flex items-center gap-2">
                      <KeyRound className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      <CardTitle className="text-base sm:text-lg">Backup Codes</CardTitle>
                    </div>
                    <CardDescription className="text-xs sm:text-sm">
                      Use these codes to sign in if you lose access to your device
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted/50 p-3 sm:p-4 font-mono text-xs sm:text-sm">
                      {backupCodes.map((c) => (
                        <span key={c} className="text-foreground">{c}</span>
                      ))}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button variant="outline" className="gap-2 flex-1" onClick={handleCopyAll}>
                        <Copy className="w-4 h-4" /> Copy All
                      </Button>
                      <Button variant="outline" className="gap-2 flex-1" onClick={handleDownload}>
                        <Download className="w-4 h-4" /> Download
                      </Button>
                      <Button variant="outline" className="gap-2 flex-1" onClick={handleRegenerate} disabled={regenerating}>
                        {regenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                        Regenerate
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  {step === "intro" && (
                    <div className="text-center py-6 sm:py-8">
                      <div className="mx-auto mb-4 rounded-full bg-primary/10 p-4 w-fit">
                        <ShieldOff className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">2FA is currently disabled</h3>
                      <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
                        Two-factor authentication adds an extra layer of security by requiring a verification code
                        in addition to your password when signing in.
                      </p>
                      <Button onClick={handleEnableClick} className="gap-2">
                        <ShieldCheck className="w-4 h-4" /> Enable 2FA
                      </Button>
                    </div>
                  )}

                  {step === "choose-method" && (
                    <div>
                      <Button variant="ghost" size="sm" className="w-fit -ml-2 mb-3 gap-1 text-muted-foreground" onClick={resetFlow}>
                        <ChevronLeft className="w-4 h-4" /> Back
                      </Button>
                      <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1">Choose a verification method</h3>
                      <p className="text-sm text-muted-foreground mb-4">Select how you'd like to receive your verification codes</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => handleChooseMethod("app")}>
                          <CardContent className="p-4 sm:p-5 flex flex-col items-center text-center gap-2">
                            <Smartphone className="w-6 h-6 text-primary" />
                            <p className="font-medium text-sm sm:text-base text-foreground">Authenticator App</p>
                            <p className="text-xs text-muted-foreground">Use an app like Google Authenticator</p>
                          </CardContent>
                        </Card>
                        <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => handleChooseMethod("sms")}>
                          <CardContent className="p-4 sm:p-5 flex flex-col items-center text-center gap-2">
                            <MessageSquare className="w-6 h-6 text-primary" />
                            <p className="font-medium text-sm sm:text-base text-foreground">SMS</p>
                            <p className="text-xs text-muted-foreground">Receive a code via text message</p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  )}

                  {step === "verify" && (
                    <div className="text-center">
                      <Button variant="ghost" size="sm" className="w-fit -ml-2 mb-3 gap-1 text-muted-foreground" onClick={() => setStep("choose-method")}>
                        <ChevronLeft className="w-4 h-4" /> Back
                      </Button>
                      <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1">Enter verification code</h3>
                      <p className="text-sm text-muted-foreground mb-6">
                        {method === "sms"
                          ? "We've sent a 6-digit code to your phone number"
                          : "Enter the 6-digit code from your authenticator app"}
                      </p>
                      <div className="flex flex-col items-center gap-3">
                        <InputOTP maxLength={6} value={code} onChange={(v) => { setCode(v); setVerifyError(""); }}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                        {verifyError && <p className="text-sm text-destructive">{verifyError}</p>}
                        <Button className="w-full sm:w-auto min-w-[200px] h-11 mt-3" onClick={handleVerify} disabled={verifying}>
                          {verifying ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifying...
                            </>
                          ) : (
                            "Verify Code"
                          )}
                        </Button>
                      </div>
                    </div>
                  )}

                  {step === "confirmed" && (
                    <div>
                      <div className="text-center mb-6">
                        <div className="mx-auto mb-3 rounded-full bg-primary/10 p-4 w-fit">
                          <ShieldCheck className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-1">Two-Factor Authentication Enabled</h3>
                        <p className="text-sm text-muted-foreground">
                          Save these backup codes somewhere safe. Each can be used once if you lose access to your device.
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted/50 p-3 sm:p-4 font-mono text-xs sm:text-sm mb-4">
                        {backupCodes.map((c) => (
                          <span key={c} className="text-foreground">{c}</span>
                        ))}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button variant="outline" className="gap-2 flex-1" onClick={handleCopyAll}>
                          <Copy className="w-4 h-4" /> Copy All
                        </Button>
                        <Button variant="outline" className="gap-2 flex-1" onClick={handleDownload}>
                          <Download className="w-4 h-4" /> Download as .txt
                        </Button>
                      </div>
                    </div>
                  )}
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
