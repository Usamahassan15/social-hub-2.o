import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type AuthView = "login" | "signup" | "forgot";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const initialView = (searchParams.get("view") as AuthView) || "login";
  const [view, setView] = useState<AuthView>(initialView);
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup state
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  // Forgot state
  const [recoverEmail, setRecoverEmail] = useState("");

  // Sample data for date dropdowns
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  useEffect(() => {
    const v = searchParams.get("view") as AuthView | null;
    if (v && v !== view) setView(v);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const goAfterAuth = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("onboarding_completed")
      .eq("id", userId)
      .maybeSingle();
    navigate(data?.onboarding_completed ? "/" : "/onboarding", { replace: true });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword) {
      toast({ title: "Missing details", description: "Enter your email and password.", variant: "destructive" });
      return;
    }
    setBusy(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail.trim(),
      password: loginPassword,
    });
    setBusy(false);
    if (error) {
      toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
      return;
    }
    if (data.user) await goAfterAuth(data.user.id);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupEmail.trim() || !signupPassword) {
      toast({ title: "Missing details", description: "Enter an email address and password.", variant: "destructive" });
      return;
    }
    if (signupPassword.length < 6) {
      toast({ title: "Password too short", description: "Use at least 6 characters.", variant: "destructive" });
      return;
    }
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email: signupEmail.trim(),
      password: signupPassword,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: `${firstName} ${surname}`.trim() },
      },
    });
    setBusy(false);
    if (error) {
      toast({ title: "Could not create account", description: error.message, variant: "destructive" });
      return;
    }
    if (data.session) {
      navigate("/onboarding", { replace: true });
      return;
    }
    toast({
      title: "Confirm your email",
      description: "We sent you a confirmation link. Click it to finish creating your account.",
    });
    setView("login");
  };

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoverEmail.trim()) {
      toast({ title: "Enter your email", description: "We need your email to find your account.", variant: "destructive" });
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(recoverEmail.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (error) {
      toast({ title: "Could not send email", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Check your email", description: "We sent you a link to reset your password." });
    setView("login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <AnimatePresence mode="wait">
          {/* Login View */}
          {view === "login" && (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100"
            >
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 text-center">
                Log in
              </h1>

              <form className="space-y-4" onSubmit={handleLogin}>
                <div>
                  <Input
                    type="text"
                    placeholder="Email address or phone number"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="h-12 sm:h-14 rounded-xl border-gray-300 text-base sm:text-lg px-4 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <Input
                    type="password"
                    placeholder="Password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="h-12 sm:h-14 rounded-xl border-gray-300 text-base sm:text-lg px-4 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={busy}
                  className="w-full h-12 sm:h-14 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl text-base sm:text-lg transition-all shadow-sm hover:shadow-md"
                >
                  Log in
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setView("forgot")}
                    className="text-primary hover:underline text-sm"
                  >
                    Forgotten password?
                  </button>
                </div>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">or</span>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={() => setView("signup")}
                  variant="outline"
                  className="w-full h-12 sm:h-14 bg-green-500 hover:bg-green-600 text-white font-semibold border-0 rounded-xl text-base sm:text-lg transition-all shadow-sm hover:shadow-md"
                >
                  Create new account
                </Button>
              </form>
            </motion.div>
          )}

          {/* Signup View */}
          {view === "signup" && (
            <motion.div
              key="signup"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100"
            >
              <div className="mb-6">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">
                  Create a new account
                </h1>
                <p className="text-gray-600 text-sm sm:text-base">It's quick and easy.</p>
              </div>

              <form className="space-y-4" onSubmit={handleSignup}>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="h-11 sm:h-12 rounded-xl border-gray-300 text-sm sm:text-base px-4 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <Input
                    type="text"
                    placeholder="Surname"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    className="h-11 sm:h-12 rounded-xl border-gray-300 text-sm sm:text-base px-4 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <Label className="text-xs sm:text-sm text-gray-700 mb-2 block">
                    Date of birth
                  </Label>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    <Select defaultValue="9">
                      <SelectTrigger className="h-11 sm:h-12 rounded-xl border-gray-300 text-sm sm:text-base">
                        <SelectValue placeholder="Day" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-xl max-h-60 z-50">
                        {days.map((day) => (
                          <SelectItem key={day} value={day.toString()} className="hover:bg-gray-100">
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select defaultValue="Nov">
                      <SelectTrigger className="h-11 sm:h-12 rounded-xl border-gray-300 text-sm sm:text-base">
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-xl max-h-60 z-50">
                        {months.map((month) => (
                          <SelectItem key={month} value={month} className="hover:bg-gray-100">
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select defaultValue="2025">
                      <SelectTrigger className="h-11 sm:h-12 rounded-xl border-gray-300 text-sm sm:text-base">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-xl max-h-60 z-50">
                        {years.map((year) => (
                          <SelectItem key={year} value={year.toString()} className="hover:bg-gray-100">
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-xs sm:text-sm text-gray-700 mb-2 block">Gender</Label>
                  <RadioGroup defaultValue="female" className="grid grid-cols-3 gap-2 sm:gap-3">
                    <label className="flex items-center space-x-2 border border-gray-300 rounded-xl p-3 cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value="female" />
                      <span className="text-sm sm:text-base">Female</span>
                    </label>
                    <label className="flex items-center space-x-2 border border-gray-300 rounded-xl p-3 cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value="male" />
                      <span className="text-sm sm:text-base">Male</span>
                    </label>
                    <label className="flex items-center space-x-2 border border-gray-300 rounded-xl p-3 cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value="custom" />
                      <span className="text-sm sm:text-base">Custom</span>
                    </label>
                  </RadioGroup>
                </div>

                <div>
                  <Input
                    type="text"
                    placeholder="Mobile number or email address"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="h-11 sm:h-12 rounded-xl border-gray-300 text-sm sm:text-base px-4 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <Input
                    type="password"
                    placeholder="New password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="h-11 sm:h-12 rounded-xl border-gray-300 text-sm sm:text-base px-4 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <p className="text-xs text-gray-500 leading-relaxed">
                  People who use our service may have uploaded your contact information to SocialHub.{" "}
                  <a href="#" className="text-primary hover:underline">
                    Learn more
                  </a>
                  .
                </p>

                <p className="text-xs text-gray-500 leading-relaxed">
                  By clicking Sign Up, you agree to our{" "}
                  <a href="#" className="text-primary hover:underline">
                    Terms
                  </a>
                  ,{" "}
                  <a href="#" className="text-primary hover:underline">
                    Privacy Policy
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-primary hover:underline">
                    Cookies Policy
                  </a>
                  . You may receive SMS notifications from us and can opt out at any time.
                </p>

                <Button
                  type="submit"
                  disabled={busy}
                  className="w-full h-11 sm:h-12 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl text-base sm:text-lg transition-all shadow-sm hover:shadow-md"
                >
                  Sign Up
                </Button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setView("login")}
                    className="text-primary hover:underline text-sm"
                  >
                    Already have an account?
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Forgot Password View */}
          {view === "forgot" && (
            <motion.div
              key="forgot"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100"
            >
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                Find Your Account
              </h1>
              <p className="text-gray-600 text-sm sm:text-base mb-6">
                Please enter your email address or mobile number to search for your account.
              </p>

              <form className="space-y-4" onSubmit={handleRecover}>
                <div>
                  <Input
                    type="text"
                    placeholder="Email address or mobile number"
                    value={recoverEmail}
                    onChange={(e) => setRecoverEmail(e.target.value)}
                    className="h-12 sm:h-14 rounded-xl border-gray-300 text-base sm:text-lg px-4 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    onClick={() => setView("login")}
                    variant="outline"
                    className="flex-1 h-11 sm:h-12 border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-xl text-base transition-all"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={busy}
                    className="flex-1 h-11 sm:h-12 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl text-base transition-all shadow-sm hover:shadow-md"
                  >
                    Search
                  </Button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Auth;
