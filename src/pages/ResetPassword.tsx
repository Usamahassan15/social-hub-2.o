import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ title: "Password too short", description: "Use at least 6 characters.", variant: "destructive" });
      return;
    }
    if (password !== confirm) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      toast({ title: "Could not update password", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Password updated", description: "You can use your new password now." });
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Set a new password</h1>
        <p className="text-gray-600 text-sm sm:text-base mb-6">
          {ready
            ? "Enter a new password for your account."
            : "Open this page from the recovery link in your email."}
        </p>
        <form className="space-y-4" onSubmit={submit}>
          <Input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 sm:h-14 rounded-xl border-gray-300 text-base sm:text-lg px-4 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <Input
            type="password"
            placeholder="Confirm new password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="h-12 sm:h-14 rounded-xl border-gray-300 text-base sm:text-lg px-4 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <Button
            type="submit"
            disabled={busy || !ready}
            className="w-full h-12 sm:h-14 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl text-base sm:text-lg transition-all shadow-sm hover:shadow-md"
          >
            Update password
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
