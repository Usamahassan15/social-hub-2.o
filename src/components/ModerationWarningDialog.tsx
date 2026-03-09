import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ShieldAlert, Ban } from "lucide-react";

interface ModerationWarningDialogProps {
  isOpen: boolean;
  onClose: () => void;
  warningNumber?: number;
  isBanned?: boolean;
  banDurationHours?: number;
  banEndsAt?: string;
  message?: string;
}

const ModerationWarningDialog = ({
  isOpen,
  onClose,
  warningNumber = 1,
  isBanned = false,
  banDurationHours = 0,
  banEndsAt,
  message,
}: ModerationWarningDialogProps) => {
  const getWarningLevel = () => {
    if (isBanned) return "banned";
    if (warningNumber >= 2) return "strong";
    return "warning";
  };

  const level = getWarningLevel();

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex justify-center mb-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              level === "banned" ? "bg-destructive/20" : "bg-yellow-500/20"
            }`}>
              {level === "banned" ? (
                <Ban className="w-8 h-8 text-destructive" />
              ) : (
                <ShieldAlert className={`w-8 h-8 ${level === "strong" ? "text-destructive" : "text-yellow-500"}`} />
              )}
            </div>
          </div>
          <AlertDialogTitle className="text-center">
            {level === "banned"
              ? "🚫 Account Temporarily Restricted"
              : level === "strong"
              ? "⚠️ Strong Warning"
              : "⚠️ Content Warning"}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center space-y-3">
            <p>
              {message || "Your upload contains content that violates our community guidelines. Adult or explicit content is not allowed on this platform."}
            </p>
            {warningNumber && warningNumber > 0 && (
              <div className="flex justify-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-xs font-medium">
                  Warning {warningNumber} of 5
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i <= warningNumber
                            ? "bg-destructive"
                            : "bg-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            {isBanned && banEndsAt && (
              <p className="text-destructive font-medium text-sm">
                Your account is restricted until{" "}
                {new Date(banEndsAt).toLocaleString()}
              </p>
            )}
            {!isBanned && warningNumber && warningNumber >= 2 && (
              <p className="text-destructive/80 text-xs">
                Continued violations will result in temporary account restrictions.
              </p>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onClose} className="w-full">
            I Understand
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ModerationWarningDialog;
