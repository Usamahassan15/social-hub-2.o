import * as React from "react";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface SuccessStateProps {
  title: string;
  description?: string;
  details?: { label: string; value: string }[];
  primaryLabel?: string;
  onPrimary?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  tertiaryLabel?: string;
  onTertiary?: () => void;
  className?: string;
}

export function SuccessState({
  title,
  description,
  details,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
  tertiaryLabel,
  onTertiary,
  className,
}: SuccessStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-10 px-4 text-center", className)}>
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="mb-4 rounded-full bg-primary/10 p-5"
      >
        <Check className="h-9 w-9 text-primary" />
      </motion.div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-muted-foreground max-w-xs mx-auto">{description}</p>
      )}

      {details && details.length > 0 && (
        <div className="mt-5 w-full max-w-sm rounded-xl border border-border divide-y divide-border text-left">
          {details.map((d) => (
            <div key={d.label} className="flex items-center justify-between px-4 py-2.5">
              <span className="text-sm text-muted-foreground">{d.label}</span>
              <span className="text-sm font-medium text-foreground">{d.value}</span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 w-full max-w-sm space-y-2">
        {primaryLabel && onPrimary && (
          <Button className="w-full h-11" onClick={onPrimary}>
            {primaryLabel}
          </Button>
        )}
        {secondaryLabel && onSecondary && (
          <Button variant="outline" className="w-full h-11" onClick={onSecondary}>
            {secondaryLabel}
          </Button>
        )}
        {tertiaryLabel && onTertiary && (
          <Button variant="ghost" className="w-full h-11" onClick={onTertiary}>
            {tertiaryLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
