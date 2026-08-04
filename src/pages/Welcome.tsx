import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Apple, Phone, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "@/hooks/use-toast";

const isIOS = () =>
  typeof navigator !== "undefined" &&
  (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && (navigator as any).maxTouchPoints > 1));

const Welcome = () => {
  const navigate = useNavigate();
  const [busy, setBusy] = useState<string | null>(null);
  const [phoneOpen, setPhoneOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);

  const oauth = async (provider: "google" | "apple") => {
    setBusy(provider);
    const result = await lovable.auth.signInWithOAuth(provider, {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setBusy(null);
      toast({
        title: "Sign in failed",
        description: result.error.message ?? "Please try again.",
        variant: "destructive",
      });
      return;
    }
    if (result.redirected) return;
    navigate("/", { replace: true });
  };

  const sendCode = async () => {
    if (!phone.trim()) return;
    setBusy("phone");
    const { error } = await supabase.auth.signInWithOtp({ phone: phone.trim() });
    setBusy(null);
    if (error) {
      toast({ title: "Could not send code", description: error.message, variant: "destructive" });
      return;
    }
    setCodeSent(true);
    toast({ title: "Code sent", description: "Check your messages for the code." });
  };

  const verifyCode = async () => {
    setBusy("phone");
    const { error } = await supabase.auth.verifyOtp({
      phone: phone.trim(),
      token: code.trim(),
      type: "sms",
    });
    setBusy(null);
    if (error) {
      toast({ title: "Invalid code", description: error.message, variant: "destructive" });
      return;
    }
    setPhoneOpen(false);
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-md bg-card rounded-2xl shadow-lg p-6 sm:p-8 border border-border"
      >
        <div className="flex flex-col items-center text-center mb-8">
          <div
            className="w-16 h-16 rounded-3xl flex items-center justify-center shadow-md mb-4"
            style={{ background: "var(--gradient-primary)" }}
          >
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="font-bold text-foreground">Welcome to SocialHub</h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Connect, share and discover with your community.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => navigate("/auth?view=login")}
            className="w-full h-12 sm:h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl text-base sm:text-lg shadow-sm hover:shadow-md transition-all"
          >
            Sign In
          </Button>

          <Button
            onClick={() => navigate("/auth?view=signup")}
            className="w-full h-12 sm:h-14 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl text-base sm:text-lg border-0 shadow-sm hover:shadow-md transition-all"
          >
            Create Account
          </Button>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-card text-muted-foreground">or</span>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            variant="outline"
            disabled={busy === "google"}
            onClick={() => oauth("google")}
            className="w-full h-12 rounded-xl text-base font-medium gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.4a5.5 5.5 0 01-2.4 3.6v3h3.9c2.2-2.1 3.6-5.2 3.6-8.8z" />
              <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3a7.2 7.2 0 01-10.7-3.8H1.3v3.1A12 12 0 0012 24z" />
              <path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 010-4.6V6.6H1.3a12 12 0 000 10.8l4-3.1z" />
              <path fill="#EA4335" d="M12 4.8c1.8 0 3.4.6 4.6 1.8l3.4-3.4A12 12 0 001.3 6.6l4 3.1A7.2 7.2 0 0112 4.8z" />
            </svg>
            Continue with Google
          </Button>

          {isIOS() && (
            <Button
              variant="outline"
              disabled={busy === "apple"}
              onClick={() => oauth("apple")}
              className="w-full h-12 rounded-xl text-base font-medium gap-3"
            >
              <Apple className="w-5 h-5" />
              Continue with Apple
            </Button>
          )}

          <Button
            variant="outline"
            onClick={() => setPhoneOpen(true)}
            className="w-full h-12 rounded-xl text-base font-medium gap-3"
          >
            <Phone className="w-5 h-5" />
            Continue with Phone Number
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-8 leading-relaxed">
          By continuing, you agree to our{" "}
          <a href="#" className="text-primary hover:underline">Terms of Service</a> and{" "}
          <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
        </p>
      </motion.div>

      <Dialog open={phoneOpen} onOpenChange={setPhoneOpen}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle>{codeSent ? "Enter the code" : "Continue with phone"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {!codeSent ? (
              <>
                <Input
                  type="tel"
                  inputMode="tel"
                  placeholder="+92 300 0000000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-12 rounded-xl"
                />
                <Button
                  onClick={sendCode}
                  disabled={busy === "phone"}
                  className="w-full h-12 rounded-xl font-semibold"
                >
                  Send code
                </Button>
              </>
            ) : (
              <>
                <Input
                  inputMode="numeric"
                  placeholder="6-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="h-12 rounded-xl tracking-widest"
                />
                <Button
                  onClick={verifyCode}
                  disabled={busy === "phone"}
                  className="w-full h-12 rounded-xl font-semibold"
                >
                  Verify & continue
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Welcome;
