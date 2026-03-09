import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

interface Post {
  id: string;
  user_id: string;
  content: string;
  media_url?: string;
  media_type?: string;
  category?: string;
  is_anonymous: boolean;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  saves_count: number;
  views_count: number;
  quality_score: number;
  engagement_rate: number;
  is_trending: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  _score?: number;
}

interface FeedResponse {
  posts: Post[];
  trending: Post[];
  feed_type: string;
}

export function useFeed(options: {
  feedType?: "personalized" | "following" | "trending" | "latest";
  category?: string;
  limit?: number;
} = {}) {
  const { feedType = "personalized", category, limit = 20 } = options;
  const [offset, setOffset] = useState(0);

  const query = useQuery({
    queryKey: ["feed", feedType, category, limit, offset],
    queryFn: async (): Promise<FeedResponse> => {
      const { data, error } = await supabase.functions.invoke("rank-feed", {
        body: { 
          feed_type: feedType, 
          category, 
          limit,
          offset,
        },
      });

      if (error) {
        console.error("Feed fetch error:", error);
        throw error;
      }

      return data as FeedResponse;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: false,
  });

  const loadMore = () => {
    setOffset(prev => prev + limit);
  };

  const refresh = () => {
    setOffset(0);
    query.refetch();
  };

  return {
    posts: query.data?.posts || [],
    trending: query.data?.trending || [],
    feedType: query.data?.feed_type || feedType,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    loadMore,
    refresh,
    hasMore: (query.data?.posts?.length || 0) >= limit,
  };
}

export function usePostEngagement(postId: string) {
  const queryClient = useQueryClient();

  const { data: userEngagements } = useQuery({
    queryKey: ["user-engagements", postId],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user) return { liked: false, saved: false };

      const { data } = await supabase
        .from("post_engagements")
        .select("engagement_type")
        .eq("post_id", postId)
        .eq("user_id", session.session.user.id);

      const types = data?.map(e => e.engagement_type) || [];
      return {
        liked: types.includes("like"),
        saved: types.includes("save"),
        shared: types.includes("share"),
      };
    },
  });

  const toggleLike = useMutation({
    mutationFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user) throw new Error("Not authenticated");

      if (userEngagements?.liked) {
        await supabase
          .from("post_engagements")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", session.session.user.id)
          .eq("engagement_type", "like");
      } else {
        await supabase
          .from("post_engagements")
          .insert({
            post_id: postId,
            user_id: session.session.user.id,
            engagement_type: "like",
          });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-engagements", postId] });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });

  const toggleSave = useMutation({
    mutationFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user) throw new Error("Not authenticated");

      if (userEngagements?.saved) {
        await supabase
          .from("post_engagements")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", session.session.user.id)
          .eq("engagement_type", "save");
      } else {
        await supabase
          .from("post_engagements")
          .insert({
            post_id: postId,
            user_id: session.session.user.id,
            engagement_type: "save",
          });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-engagements", postId] });
    },
  });

  const recordShare = useMutation({
    mutationFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user) return;

      await supabase
        .from("post_engagements")
        .upsert({
          post_id: postId,
          user_id: session.session.user.id,
          engagement_type: "share",
        }, { onConflict: "post_id,user_id,engagement_type" });
    },
  });

  const recordView = useMutation({
    mutationFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user) return;

      await supabase
        .from("post_engagements")
        .upsert({
          post_id: postId,
          user_id: session.session.user.id,
          engagement_type: "view",
        }, { onConflict: "post_id,user_id,engagement_type" });
    },
  });

  return {
    isLiked: userEngagements?.liked || false,
    isSaved: userEngagements?.saved || false,
    toggleLike: toggleLike.mutate,
    toggleSave: toggleSave.mutate,
    recordShare: recordShare.mutate,
    recordView: recordView.mutate,
    isLiking: toggleLike.isPending,
    isSaving: toggleSave.isPending,
  };
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (post: {
      content: string;
      media_url?: string;
      media_type?: string;
      category?: string;
      is_anonymous?: boolean;
    }) => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("posts")
        .insert({
          user_id: session.session.user.id,
          content: post.content,
          media_url: post.media_url,
          media_type: post.media_type,
          category: post.category,
          is_anonymous: post.is_anonymous || false,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });
}

export function useTrendingTopics() {
  return useQuery({
    queryKey: ["trending-topics"],
    queryFn: async () => {
      const { data } = await supabase
        .from("posts")
        .select("category")
        .not("category", "is", null)
        .order("created_at", { ascending: false })
        .limit(100);

      if (!data) return [];

      // Count categories
      const counts: Record<string, number> = {};
      data.forEach(p => {
        if (p.category) {
          counts[p.category] = (counts[p.category] || 0) + 1;
        }
      });

      // Sort by count
      return Object.entries(counts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([category, count]) => ({
          tag: `#${category}`,
          posts: `${count >= 1000 ? (count / 1000).toFixed(1) + "K" : count} posts`,
        }));
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useUserInterests() {
  const queryClient = useQueryClient();

  const { data: interests } = useQuery({
    queryKey: ["user-interests"],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user) return [];

      const { data } = await supabase
        .from("user_interests")
        .select("*")
        .eq("user_id", session.session.user.id)
        .order("interest_score", { ascending: false });

      return data || [];
    },
  });

  const updateInterest = useMutation({
    mutationFn: async ({ category, delta }: { category: string; delta: number }) => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user) return;

      // Upsert interest
      const currentInterest = interests?.find(i => i.category === category);
      const newScore = Math.max(0, Math.min(1, (currentInterest?.interest_score || 0.5) + delta));

      await supabase
        .from("user_interests")
        .upsert({
          user_id: session.session.user.id,
          category,
          interest_score: newScore,
          interaction_count: (currentInterest?.interaction_count || 0) + 1,
          last_interaction_at: new Date().toISOString(),
        }, { onConflict: "user_id,category" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-interests"] });
    },
  });

  return {
    interests: interests || [],
    updateInterest: updateInterest.mutate,
  };
}
