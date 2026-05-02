import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, RefreshCw } from "lucide-react";
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

const SUGGESTED_POSTS = [
  {
    id: "suggested-1",
    user_id: "user-1",
    content: "Just launched our new AI-powered design tool! 🚀 It can generate stunning UI mockups in seconds. What do you think about AI in the design workflow?",
    media_url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop",
    media_type: "image",
    category: "technology",
    is_anonymous: false,
    likes_count: 234,
    comments_count: 45,
    shares_count: 18,
    saves_count: 67,
    views_count: 1200,
    quality_score: 0.9,
    engagement_rate: 0.15,
    is_trending: true,
    is_featured: false,
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    updated_at: new Date().toISOString(),
    author: "Sarah Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  },
  {
    id: "suggested-2",
    user_id: "user-2",
    content: "5 lessons I learned from building my startup from scratch 💡\n\n1. Start small, think big\n2. Talk to your users daily\n3. Ship fast, iterate faster\n4. Build a great team\n5. Never stop learning",
    category: "startup",
    is_anonymous: false,
    likes_count: 512,
    comments_count: 89,
    shares_count: 156,
    saves_count: 203,
    views_count: 5400,
    quality_score: 0.95,
    engagement_rate: 0.22,
    is_trending: true,
    is_featured: true,
    created_at: new Date(Date.now() - 5 * 3600000).toISOString(),
    updated_at: new Date().toISOString(),
    author: "Alex Rivera",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  },
  {
    id: "suggested-3",
    user_id: "user-3",
    content: "Beautiful sunset captured during my trip to Bali 🌅 Nature never fails to amaze me. Sometimes you need to disconnect to reconnect.",
    media_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop",
    media_type: "image",
    category: "travel",
    is_anonymous: false,
    likes_count: 789,
    comments_count: 34,
    shares_count: 56,
    saves_count: 123,
    views_count: 3200,
    quality_score: 0.85,
    engagement_rate: 0.18,
    is_trending: false,
    is_featured: false,
    created_at: new Date(Date.now() - 8 * 3600000).toISOString(),
    updated_at: new Date().toISOString(),
    author: "Maya Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maya",
  },
  {
    id: "suggested-4",
    user_id: "user-4",
    content: "The future of web development is here! 🔥 WebAssembly + AI = mind-blowing possibilities. Who else is excited about this tech stack?",
    category: "ai",
    is_anonymous: false,
    likes_count: 345,
    comments_count: 67,
    shares_count: 45,
    saves_count: 89,
    views_count: 2100,
    quality_score: 0.88,
    engagement_rate: 0.2,
    is_trending: false,
    is_featured: false,
    created_at: new Date(Date.now() - 12 * 3600000).toISOString(),
    updated_at: new Date().toISOString(),
    author: "Ryan Kim",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ryan",
  },
  {
    id: "suggested-5",
    user_id: "user-5",
    content: "Just finished reading 'Atomic Habits' by James Clear. Game changer! 📚 Small changes really do compound into remarkable results. What's your favorite productivity book?",
    media_url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=400&fit=crop",
    media_type: "image",
    category: "lifestyle",
    is_anonymous: false,
    likes_count: 456,
    comments_count: 123,
    shares_count: 78,
    saves_count: 234,
    views_count: 4500,
    quality_score: 0.92,
    engagement_rate: 0.25,
    is_trending: true,
    is_featured: false,
    created_at: new Date(Date.now() - 18 * 3600000).toISOString(),
    updated_at: new Date().toISOString(),
    author: "Emma Wilson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
  },
  {
    id: "suggested-6",
    user_id: "user-6",
    content: "New music drop! 🎵 Been working on this track for 3 months. Electronic meets jazz - a fusion that I think you'll love. Let me know what you think!",
    category: "music",
    is_anonymous: false,
    likes_count: 189,
    comments_count: 42,
    shares_count: 23,
    saves_count: 56,
    views_count: 1800,
    quality_score: 0.8,
    engagement_rate: 0.14,
    is_trending: false,
    is_featured: false,
    created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
    updated_at: new Date().toISOString(),
    author: "DJ Marcus",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
  },
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

  const feedPosts = posts.length > 0 ? posts : SUGGESTED_POSTS;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <TopBar />

      <main className="flex-1 md:ml-64 lg:ml-72 xl:ml-80 lg:mr-72 xl:mr-80 pb-16 md:pb-8 pt-14 md:pt-14">
        <div className="w-full max-w-[100vw] sm:max-w-xl lg:max-w-[680px] mx-auto px-0 sm:px-4 md:px-6 pt-2 sm:pt-4 md:pt-8 overflow-hidden">
          {/* Stories */}
          <div className="mb-3 sm:mb-4">
            <Stories />
          </div>

          {/* Feed Type Selector */}
          <div className="mb-3 sm:mb-4">
            <FeedTypeSelector
              value={feedType}
              onChange={(val) => setFeedType(val as any)}
            />
          </div>

          {/* Trending topics (compact) */}
          {trending.length > 0 && feedType === "personalized" && (
            <div className="mb-3 sm:mb-4">
              <TrendingSection variant="compact" />
            </div>
          )}

          {/* Feed */}
          <div className="space-y-3 sm:space-y-4">
            {isLoading ? (
              <>
                <FeedSkeleton />
                <FeedSkeleton />
              </>
            ) : (
              feedPosts.map((post, index) => (
                <React.Fragment key={post.id}>
                  {index === 3 && <PeopleYouMayKnow />}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.25, delay: Math.min(index * 0.03, 0.12) }}
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
      <div className="hidden md:block fixed bottom-8 right-6 z-40">
        <Button
          size="icon"
          onClick={() => setIsCreatePostOpen(true)}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-primary/80 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-7 h-7" />
        </Button>
      </div>

      <CreatePost isOpen={isCreatePostOpen} onClose={() => setIsCreatePostOpen(false)} />
    </div>
  );
};

export default Home;