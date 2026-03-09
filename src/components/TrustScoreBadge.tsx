import { Shield, ShieldCheck, ShieldAlert, ShieldX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TrustScoreBadgeProps {
  score: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

const TrustScoreBadge = ({ score, showLabel = false, size = "md" }: TrustScoreBadgeProps) => {
  const getScoreLevel = () => {
    if (score >= 80) return { level: "high", color: "text-green-500", bg: "bg-green-500/10", label: "Trusted", icon: ShieldCheck };
    if (score >= 50) return { level: "medium", color: "text-blue-500", bg: "bg-blue-500/10", label: "Standard", icon: Shield };
    if (score >= 30) return { level: "low", color: "text-yellow-500", bg: "bg-yellow-500/10", label: "Limited", icon: ShieldAlert };
    return { level: "very_low", color: "text-destructive", bg: "bg-destructive/10", label: "Restricted", icon: ShieldX };
  };

  const { color, bg, label, icon: Icon } = getScoreLevel();

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full ${bg} cursor-help`}>
          <Icon className={`${iconSizes[size]} ${color}`} />
          {showLabel && (
            <span className={`text-xs font-medium ${color}`}>{label}</span>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <div className="space-y-1">
          <p className="font-medium">Trust Score: {score}/100</p>
          <p className="text-xs text-muted-foreground">
            {score >= 80 && "This user has excellent standing in the community."}
            {score >= 50 && score < 80 && "This user has good standing."}
            {score >= 30 && score < 50 && "This user has limited trust due to past activity."}
            {score < 30 && "This user is restricted due to violations."}
          </p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

export default TrustScoreBadge;
