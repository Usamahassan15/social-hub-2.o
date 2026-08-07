import * as React from "react";
import { AlertTriangle, WifiOff, RefreshCw, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface ErrorStateProps {
  title?: string;
  description?: string;
  variant?: "generic" | "offline";
  onRetry?: () => void;
  onBack?: () => void;
  className?: string;
}

export function ErrorState({
  title,
  description,
  variant = "generic",
  onRetry,
  onBack,
  className,
}: ErrorStateProps) {
  const Icon = variant === "offline" ? WifiOff : AlertTriangle;
  const heading =
    title ?? (variant === "offline" ? "No internet connection" : "Something went wrong");
  const body =
    description ??
    (variant === "offline"
      ? "Please check your connection and try again."
      : "We couldn't load this content right now.");

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 px-4 text-center animate-in fade-in zoom-in duration-300",
        className
      )}
    >
      <div className="mb-4 rounded-full bg-destructive/10 p-4">
        <Icon className="h-8 w-8 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">{heading}</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-xs mx-auto">{body}</p>
      <div className="mt-6 flex items-center gap-2">
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
          </Button>
        )}
        {onRetry && (
          <Button onClick={onRetry}>
            <RefreshCw className="w-4 h-4 mr-2" /> Try Again
          </Button>
        )}
      </div>
    </div>
  );
}
