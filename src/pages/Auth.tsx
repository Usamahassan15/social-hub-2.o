import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary-glow/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.1),transparent_50%)]" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="p-8 glass-effect">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-primary to-primary-glow mb-4 glow-effect"
            >
              <Sparkles className="w-8 h-8 text-primary-foreground" />
            </motion.div>
            <h1 className="text-3xl font-bold gradient-text mb-2">
              {isLogin ? "Welcome Back" : "Join Us"}
            </h1>
            <p className="text-muted-foreground">
              {isLogin ? "Sign in to continue" : "Create your account"}
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={isLogin ? "login" : "signup"}
              initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
              className="space-y-4"
            >
              {!isLogin && (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Full Name"
                    className="pl-10 h-12"
                  />
                </div>
              )}
              
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Email"
                  className="pl-10 h-12"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Password"
                  className="pl-10 h-12"
                />
              </div>

              {isLogin && (
                <div className="text-right">
                  <Button variant="link" className="text-primary p-0 h-auto">
                    Forgot password?
                  </Button>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 transition-opacity"
              >
                {isLogin ? "Sign In" : "Create Account"}
              </Button>
            </motion.form>
          </AnimatePresence>

          <div className="mt-6 text-center">
            <span className="text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </span>
            <Button
              variant="link"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary ml-1 p-0 h-auto"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Auth;
