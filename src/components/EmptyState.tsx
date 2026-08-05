import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  compact?: boolean;
}

export default function EmptyState({ icon: Icon, title, description, actionLabel, onAction, compact = false }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col items-center justify-center px-6 text-center ${compact ? "py-10" : "min-h-[320px] py-16"}`}
    >
      <motion.div
        initial={{ scale: 0.85 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 16 }}
        className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20"
      >
        <Icon className="h-9 w-9 text-primary" aria-hidden="true" />
      </motion.div>
      <h3 className="text-xl font-semibold text-foreground">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-6 bg-gradient-to-r from-primary to-primary-glow">
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
}