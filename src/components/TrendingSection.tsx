import { TrendingUp, Flame, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useTrendingTopics } from "@/hooks/use-feed";

interface TrendingSectionProps {
  variant?: "compact" | "full";
  onTopicClick?: (topic: string) => void;
}

const TrendingSection = ({ variant = "compact", onTopicClick }: TrendingSectionProps) => {
  const { data: topics, isLoading } = useTrendingTopics();

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Flame className="w-5 h-5 text-orange-500" />
          <h3 className="font-semibold text-foreground">Trending</h3>
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-10 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </Card>
    );
  }

  if (!topics || topics.length === 0) {
    return null;
  }

  if (variant === "compact") {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Flame className="w-5 h-5 text-orange-500" />
          <h3 className="font-semibold text-foreground">Trending Now</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {topics.slice(0, 6).map((topic, idx) => (
            <motion.div
              key={topic.tag}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Badge
                variant="secondary"
                className="cursor-pointer hover:bg-primary/20 transition-colors"
                onClick={() => onTopicClick?.(topic.tag.replace("#", ""))}
              >
                {topic.tag}
              </Badge>
            </motion.div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-orange-500" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Trending Topics</h3>
          <p className="text-xs text-muted-foreground">What's popular right now</p>
        </div>
      </div>
      <div className="space-y-2">
        {topics.map((topic, idx) => (
          <motion.div
            key={topic.tag}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
            onClick={() => onTopicClick?.(topic.tag.replace("#", ""))}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground w-5">
                {idx + 1}
              </span>
              <div>
                <p className="font-semibold text-sm text-foreground">{topic.tag}</p>
                <p className="text-xs text-muted-foreground">{topic.posts}</p>
              </div>
            </div>
            {idx < 3 && (
              <Sparkles className="w-4 h-4 text-yellow-500" />
            )}
          </motion.div>
        ))}
      </div>
    </Card>
  );
};

export default TrendingSection;
