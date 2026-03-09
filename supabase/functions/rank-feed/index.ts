import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Ranking weights
const WEIGHTS = {
  likes: 1.0,
  comments: 2.0,
  shares: 3.0,
  saves: 2.5,
  views: 0.1,
  recency: 2.0,
  quality: 1.5,
  relevance: 2.0,
  following: 3.0,
  creator_boost: 1.5,
  diversity_penalty: -0.5,
};

// Time decay factor (hours)
const TIME_DECAY_HOURS = 24;
const CREATOR_BOOST_DAYS = 30; // New creator boost period

interface RankedPost {
  post: any;
  score: number;
  signals: {
    engagement: number;
    recency: number;
    relevance: number;
    quality: number;
    following: number;
    creatorBoost: number;
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Get current user if authenticated
    let currentUserId: string | null = null;
    let userInterests: Record<string, number> = {};
    let followingIds: string[] = [];
    
    if (authHeader) {
      const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        global: { headers: { Authorization: authHeader } },
      });
      const { data: { user } } = await userClient.auth.getUser();
      currentUserId = user?.id || null;
      
      if (currentUserId) {
        // Get user interests
        const { data: interests } = await adminClient
          .from("user_interests")
          .select("category, interest_score")
          .eq("user_id", currentUserId);
        
        if (interests) {
          userInterests = Object.fromEntries(
            interests.map(i => [i.category, Number(i.interest_score)])
          );
        }
        
        // Get following list
        const { data: follows } = await adminClient
          .from("user_follows")
          .select("following_id")
          .eq("follower_id", currentUserId);
        
        if (follows) {
          followingIds = follows.map(f => f.following_id);
        }
      }
    }

    const { feed_type, limit = 20, offset = 0, category } = await req.json();

    // Fetch posts with their metrics
    let query = adminClient
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit * 3); // Fetch extra for re-ranking
    
    if (category) {
      query = query.eq("category", category);
    }

    const { data: posts, error } = await query;
    
    if (error) throw error;
    if (!posts || posts.length === 0) {
      return new Response(
        JSON.stringify({ posts: [], trending: [] }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Calculate scores for each post
    const now = new Date();
    const rankedPosts: RankedPost[] = posts.map(post => {
      const postAge = (now.getTime() - new Date(post.created_at).getTime()) / (1000 * 60 * 60);
      
      // 1. Engagement score
      const totalEngagements = 
        post.likes_count * WEIGHTS.likes +
        post.comments_count * WEIGHTS.comments +
        post.shares_count * WEIGHTS.shares +
        post.saves_count * WEIGHTS.saves +
        post.views_count * WEIGHTS.views;
      
      const engagementRate = post.views_count > 0 
        ? totalEngagements / post.views_count 
        : totalEngagements / 10;
      
      const engagementScore = Math.log10(1 + totalEngagements) * (1 + engagementRate);
      
      // 2. Recency score (exponential decay)
      const recencyScore = Math.exp(-postAge / TIME_DECAY_HOURS) * WEIGHTS.recency;
      
      // 3. Relevance score (based on user interests)
      let relevanceScore = 0.5; // Default for anonymous users
      if (currentUserId && post.category && userInterests[post.category]) {
        relevanceScore = userInterests[post.category];
      }
      
      // 4. Quality score
      const qualityScore = Number(post.quality_score || 0.5) * WEIGHTS.quality;
      
      // 5. Following boost
      const followingScore = followingIds.includes(post.user_id) ? WEIGHTS.following : 0;
      
      // 6. New creator boost
      let creatorBoostScore = 0;
      // If creator joined recently and has decent engagement rate, boost them
      if (engagementRate > 0.1 && postAge < CREATOR_BOOST_DAYS * 24) {
        const creatorAge = postAge / (CREATOR_BOOST_DAYS * 24);
        creatorBoostScore = (1 - creatorAge) * WEIGHTS.creator_boost;
      }
      
      // Calculate final score
      const finalScore = 
        engagementScore * WEIGHTS.likes +
        recencyScore +
        relevanceScore * WEIGHTS.relevance +
        qualityScore +
        followingScore +
        creatorBoostScore;
      
      return {
        post,
        score: finalScore,
        signals: {
          engagement: engagementScore,
          recency: recencyScore,
          relevance: relevanceScore,
          quality: qualityScore,
          following: followingScore,
          creatorBoost: creatorBoostScore,
        },
      };
    });

    // Sort by score
    rankedPosts.sort((a, b) => b.score - a.score);

    // Apply diversity - avoid showing too many posts from same creator
    const diversifiedPosts: RankedPost[] = [];
    const authorCounts: Record<string, number> = {};
    const MAX_CONSECUTIVE_SAME_AUTHOR = 2;
    
    for (const rankedPost of rankedPosts) {
      const authorId = rankedPost.post.user_id;
      const count = authorCounts[authorId] || 0;
      
      if (count < MAX_CONSECUTIVE_SAME_AUTHOR) {
        diversifiedPosts.push(rankedPost);
        authorCounts[authorId] = count + 1;
      } else {
        // Apply diversity penalty and add to end
        rankedPost.score += WEIGHTS.diversity_penalty;
      }
      
      if (diversifiedPosts.length >= limit) break;
    }

    // Get trending posts (high velocity in last 6 hours)
    const sixHoursAgo = new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString();
    
    const { data: trendingData } = await adminClient
      .from("posts")
      .select("*")
      .gt("created_at", sixHoursAgo)
      .order("engagement_rate", { ascending: false })
      .limit(10);

    // Calculate trending velocity
    const trending = (trendingData || []).map(post => {
      const velocity = 
        post.likes_count * 0.3 +
        post.comments_count * 0.4 +
        post.shares_count * 0.3;
      return { ...post, velocity };
    }).sort((a, b) => b.velocity - a.velocity).slice(0, 5);

    // Use AI to predict engagement (optional)
    if (LOVABLE_API_KEY && diversifiedPosts.length > 0 && currentUserId) {
      try {
        // Sample posts for AI prediction
        const samplePosts = diversifiedPosts.slice(0, 5).map(p => ({
          content: p.post.content.substring(0, 100),
          category: p.post.category,
          engagement: p.signals.engagement,
        }));

        const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash-lite",
            messages: [
              {
                role: "system",
                content: `You're a feed ranking assistant. Given posts and user interests, predict engagement likelihood.
User interests: ${JSON.stringify(userInterests)}
Return JSON array of indices sorted by predicted engagement: {"ranking": [0,2,1,4,3]}`,
              },
              {
                role: "user",
                content: JSON.stringify(samplePosts),
              },
            ],
          }),
        });

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          const aiText = aiData.choices?.[0]?.message?.content || "";
          try {
            const jsonMatch = aiText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              const { ranking } = JSON.parse(jsonMatch[0]);
              if (Array.isArray(ranking)) {
                // Apply AI boost to top predicted posts
                ranking.forEach((idx: number, rank: number) => {
                  if (idx < diversifiedPosts.length) {
                    diversifiedPosts[idx].score += (5 - rank) * 0.5;
                  }
                });
                // Re-sort after AI boost
                diversifiedPosts.sort((a, b) => b.score - a.score);
              }
            }
          } catch {
            // AI parsing failed, use original ranking
          }
        }
      } catch {
        // AI call failed, use original ranking
      }
    }

    return new Response(
      JSON.stringify({
        posts: diversifiedPosts.slice(0, limit).map(p => ({
          ...p.post,
          _score: p.score,
          _signals: p.signals,
        })),
        trending,
        feed_type: feed_type || "personalized",
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Feed ranking error:", error);
    return new Response(
      JSON.stringify({ error: "Feed ranking failed", posts: [] }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
