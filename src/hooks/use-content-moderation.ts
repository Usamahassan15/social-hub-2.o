import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface ModerationResult {
  allowed: boolean;
  reason?: string;
  violation_type?: string;
  warning_number?: number;
  is_banned?: boolean;
  ban_duration_hours?: number;
  ban_ends_at?: string;
  message?: string;
}

export function useContentModeration() {
  const [isChecking, setIsChecking] = useState(false);

  const moderateText = async (
    text: string,
    contentType: string = "text",
    checkSpam: boolean = true
  ): Promise<ModerationResult> => {
    setIsChecking(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return { allowed: true };
      }

      const response = await supabase.functions.invoke("moderate-content", {
        body: { 
          text_content: text, 
          content_type: contentType,
          check_spam: checkSpam,
        },
      });

      if (response.error) {
        console.error("Moderation error:", response.error);
        return { allowed: true };
      }

      const result = response.data as ModerationResult;

      if (!result.allowed) {
        toast({
          variant: "destructive",
          title: getToastTitle(result),
          description: result.message || "Your content violates community guidelines.",
        });
      }

      return result;
    } catch (error) {
      console.error("Moderation check failed:", error);
      return { allowed: true };
    } finally {
      setIsChecking(false);
    }
  };

  const moderateImage = async (
    file: File,
    contentType: string = "image"
  ): Promise<ModerationResult> => {
    setIsChecking(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return { allowed: true };
      }

      const base64 = await fileToBase64(file);

      const response = await supabase.functions.invoke("moderate-content", {
        body: { 
          image_base64: base64, 
          content_type: contentType,
          check_spam: true,
        },
      });

      if (response.error) {
        console.error("Image moderation error:", response.error);
        return { allowed: true };
      }

      const result = response.data as ModerationResult;

      if (!result.allowed) {
        toast({
          variant: "destructive",
          title: getToastTitle(result),
          description: result.message || "This image violates our community guidelines.",
        });
      }

      return result;
    } catch (error) {
      console.error("Image moderation failed:", error);
      return { allowed: true };
    } finally {
      setIsChecking(false);
    }
  };

  const checkBanStatus = async (): Promise<{ isBanned: boolean; banEndsAt?: string; isRestricted?: boolean; restrictionReason?: string }> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return { isBanned: false };

      const response = await supabase.functions.invoke("moderate-content", {
        body: { text_content: "", content_type: "ban_check" },
      });

      if (response.error) {
        if (response.error.message?.includes("403")) {
          return { isBanned: true };
        }
        return { isBanned: false };
      }

      const result = response.data;
      if (result?.reason === "account_banned") {
        return { isBanned: true, banEndsAt: result.ban_ends_at };
      }
      if (result?.reason === "account_restricted") {
        return { isBanned: false, isRestricted: true, restrictionReason: result.message };
      }

      return { isBanned: false };
    } catch {
      return { isBanned: false };
    }
  };

  return { moderateText, moderateImage, checkBanStatus, isChecking };
}

function getToastTitle(result: ModerationResult): string {
  if (result.is_banned) return "🚫 Account Restricted";
  if (result.reason === "rate_limited") return "⏳ Slow Down";
  if (result.reason === "duplicate_content") return "📝 Duplicate Content";
  
  switch (result.violation_type) {
    case "scam":
    case "phishing":
      return "🚨 Scam Detected";
    case "hate_speech":
    case "harassment":
      return "🚫 Hate Speech Detected";
    case "unsafe_link":
      return "⚠️ Unsafe Link Detected";
    case "spam":
      return "🚫 Spam Detected";
    default:
      return "⚠️ Content Blocked";
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
