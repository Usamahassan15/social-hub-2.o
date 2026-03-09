import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, RefreshCw, Loader2, Sparkles } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import TopBar from "@/components/TopBar";
import Stories from "@/components/Stories";
import PeopleYouMayKnow from "@/components/PeopleYouMayKnow";
import CreatePost from "@/components/CreatePost";
import FeedTypeSelector from "@/components/FeedTypeSelector";
import TrendingSection from "@/components/TrendingSection";
import LivePost from "@/components/LivePost";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useFeed } from "@/hooks/use-feed";
import { Skeleton } from "@/components/ui/skeleton";

const POST_CATEGORIES = [
  "technology", "design", "startup", "ai", "business",
  "science", "art", "sports", "music", "travel", "lifestyle", "news"
];

const FeedSkeleton = () => (
  <Card className="p-4 space-y-3">
    <div className="flex items-center gap-2">
      <Skeleton className="w-9 h-9 rounded-full" />
      <div className="space-y-1 flex-1">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-48 w-full rounded-lg" />
    <div className="grid grid-cols-4 gap-2">
      {[1,2,3,4].map(i => <Skeleton key={i} className="h-8" />)}
    </div>
  </Card>
);

const Home = () => {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [feedType, setFeedType] = useState<"personalized" | "following" | "trending" | "latest">("personalized");
  
  const { posts, trending, isLoading, refresh, loadMore, hasMore } = useFeed({
    feedType,
    limit: 10,
  });

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <TopBar />

      <main className="flex-1 md:ml-64 pb-16 md:pb-8 pt-14 md:pt-14">
        <div className="w-full max-w-[100vw] sm:max-w-xl lg:max-w-[680px] lg:mx-0 lg:ml-8 mx-auto px-0 sm:px-4 md:px-6 pt-2 sm:pt-4 md:pt-8 overflow-hidden">
          {/* Stories */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 sm:mb-4"
          >
            <Stories />
          </motion.div>

          {/* Feed Type Selector */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-3 sm:mb-4"
          >
            <FeedTypeSelector
              value={feedType}
              onChange={(val) => {
                setFeedType(val as any);
              }}
            />
          </motion.div>

          {/* Trending topics (compact) */}
          {trending.length > 0 && feedType === "personalized" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="mb-3 sm:mb-4"
            >
              <TrendingSection variant="compact" />
            </motion.div>
          )}

          {/* Feed */}
          <div className="space-y-3 sm:space-y-4">
            {isLoading ? (
              <>
                <FeedSkeleton />
                <FeedSkeleton />
                <FeedSkeleton />
              </>
            ) : posts.length === 0 ? (
              <Card className="p-8 text-center">
                <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {feedType === "following" ? "Follow more people" : "No posts yet"}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {feedType === "following"
                    ? "Follow accounts to see their posts here"
                    : "Be the first to create a post!"}
                </p>
                <Button onClick={() => setIsCreatePostOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Post
                </Button>
              </Card>
            ) : (
              posts.map((post, index) => (
                <React.Fragment key={post.id}>
                  {index === 3 && <PeopleYouMayKnow />}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <LivePost {...post} />
                  </motion.div>
                </React.Fragment>
              ))
            )}

            {/* Load More */}
            {!isLoading && posts.length > 0 && (
              <div className="flex gap-2 pb-4">
                {hasMore && (
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={loadMore}
                  >
                    Load More
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={refresh}
                  title="Refresh feed"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <MobileNav />

      {/* FAB */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="hidden md:block fixed bottom-8 right-6 z-40"
      >
        <Button
          size="icon"
          onClick={() => setIsCreatePostOpen(true)}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-[hsl(199,100%,50%)] to-[hsl(207,90%,54%)] shadow-lg hover:shadow-xl"
        >
          <Plus className="w-7 h-7" />
        </Button>
      </motion.div>

      <CreatePost isOpen={isCreatePostOpen} onClose={() => setIsCreatePostOpen(false)} />
    </div>
  );
};

export default Home;
