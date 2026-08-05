import { Heart, MessageCircle, Send, Bookmark } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const actions = [Heart, MessageCircle, Send, Bookmark];

export default function FeedPostSkeleton() {
  return (
    <Card className="overflow-hidden rounded-none border-x-0 p-4 sm:rounded-lg sm:border-x" aria-label="Loading post">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
      <Skeleton className="mt-4 aspect-[4/3] w-full rounded-lg" />
      <div className="mt-4 grid grid-cols-4 gap-3 border-t border-border pt-3">
        {actions.map((Icon, index) => (
          <div key={index} className="flex items-center justify-center gap-2 text-muted-foreground/40">
            <Icon className="h-5 w-5" />
            <Skeleton className="hidden h-3 w-10 sm:block" />
          </div>
        ))}
      </div>
    </Card>
  );
}