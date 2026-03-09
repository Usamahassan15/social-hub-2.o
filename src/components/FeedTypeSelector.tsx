import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Users, TrendingUp, Clock } from "lucide-react";

interface FeedTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const FeedTypeSelector = ({ value, onChange }: FeedTypeSelectorProps) => {
  return (
    <Tabs value={value} onValueChange={onChange} className="w-full">
      <TabsList className="grid grid-cols-4 h-10 bg-muted/50">
        <TabsTrigger value="personalized" className="text-xs gap-1">
          <Home className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">For You</span>
        </TabsTrigger>
        <TabsTrigger value="following" className="text-xs gap-1">
          <Users className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Following</span>
        </TabsTrigger>
        <TabsTrigger value="trending" className="text-xs gap-1">
          <TrendingUp className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Trending</span>
        </TabsTrigger>
        <TabsTrigger value="latest" className="text-xs gap-1">
          <Clock className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Latest</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default FeedTypeSelector;
