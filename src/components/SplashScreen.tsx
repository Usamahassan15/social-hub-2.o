import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const SplashScreen = () => (
  <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background">
    <motion.div
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      <motion.div
        animate={{ scale: [1, 1.25, 1], opacity: [0.45, 0.15, 0.45] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 rounded-3xl bg-primary blur-2xl"
      />
      <div
        className="relative w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg"
        style={{ background: "var(--gradient-primary)" }}
      >
        <Sparkles className="w-10 h-10 text-primary-foreground" />
      </div>
    </motion.div>

    <motion.h1
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.5 }}
      className="mt-6 gradient-text font-bold"
    >
      SocialHub
    </motion.h1>

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="mt-8 h-1 w-32 rounded-full bg-muted overflow-hidden"
    >
      <motion.div
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
        className="h-full w-1/2 rounded-full bg-primary"
      />
    </motion.div>
  </div>
);

export default SplashScreen;
