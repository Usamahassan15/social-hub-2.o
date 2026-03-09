
-- Posts table
CREATE TABLE public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  media_url TEXT,
  media_type TEXT,
  category TEXT,
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  
  -- Engagement metrics (denormalized for performance)
  likes_count INTEGER NOT NULL DEFAULT 0,
  comments_count INTEGER NOT NULL DEFAULT 0,
  shares_count INTEGER NOT NULL DEFAULT 0,
  saves_count INTEGER NOT NULL DEFAULT 0,
  views_count INTEGER NOT NULL DEFAULT 0,
  
  -- Quality & ranking signals
  quality_score NUMERIC(3,2) DEFAULT 0.5,
  engagement_rate NUMERIC(5,4) DEFAULT 0,
  is_trending BOOLEAN NOT NULL DEFAULT false,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view posts"
  ON public.posts FOR SELECT USING (true);

CREATE POLICY "Users can create posts"
  ON public.posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
  ON public.posts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON public.posts FOR DELETE
  USING (auth.uid() = user_id);

-- Post engagements table
CREATE TABLE public.post_engagements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  engagement_type TEXT NOT NULL, -- like, comment, share, save, view, click
  duration_seconds INTEGER, -- for video watch time
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id, engagement_type)
);

ALTER TABLE public.post_engagements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own engagements"
  ON public.post_engagements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create engagements"
  ON public.post_engagements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own engagements"
  ON public.post_engagements FOR DELETE
  USING (auth.uid() = user_id);

-- User interests table
CREATE TABLE public.user_interests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  category TEXT NOT NULL,
  interest_score NUMERIC(3,2) NOT NULL DEFAULT 0.5,
  interaction_count INTEGER NOT NULL DEFAULT 0,
  last_interaction_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, category)
);

ALTER TABLE public.user_interests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own interests"
  ON public.user_interests FOR SELECT
  USING (auth.uid() = user_id);

-- User follows table
CREATE TABLE public.user_follows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID NOT NULL,
  following_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(follower_id, following_id)
);

ALTER TABLE public.user_follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view follows"
  ON public.user_follows FOR SELECT USING (true);

CREATE POLICY "Users can create follows"
  ON public.user_follows FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can delete own follows"
  ON public.user_follows FOR DELETE
  USING (auth.uid() = follower_id);

-- Trending posts cache table
CREATE TABLE public.trending_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE UNIQUE,
  trending_score NUMERIC(10,4) NOT NULL,
  velocity NUMERIC(10,4) NOT NULL DEFAULT 0,
  calculated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.trending_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view trending"
  ON public.trending_posts FOR SELECT USING (true);

-- Indexes for performance
CREATE INDEX idx_posts_user_id ON public.posts(user_id);
CREATE INDEX idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX idx_posts_category ON public.posts(category);
CREATE INDEX idx_posts_engagement_rate ON public.posts(engagement_rate DESC);
CREATE INDEX idx_posts_trending ON public.posts(is_trending) WHERE is_trending = true;
CREATE INDEX idx_engagements_post_id ON public.post_engagements(post_id);
CREATE INDEX idx_engagements_user_id ON public.post_engagements(user_id);
CREATE INDEX idx_interests_user_id ON public.user_interests(user_id);
CREATE INDEX idx_follows_follower ON public.user_follows(follower_id);
CREATE INDEX idx_follows_following ON public.user_follows(following_id);
CREATE INDEX idx_trending_score ON public.trending_posts(trending_score DESC);

-- Triggers
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_interests_updated_at
  BEFORE UPDATE ON public.user_interests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to update post engagement counts
CREATE OR REPLACE FUNCTION public.update_post_engagement_counts()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.posts SET
      likes_count = likes_count + CASE WHEN NEW.engagement_type = 'like' THEN 1 ELSE 0 END,
      comments_count = comments_count + CASE WHEN NEW.engagement_type = 'comment' THEN 1 ELSE 0 END,
      shares_count = shares_count + CASE WHEN NEW.engagement_type = 'share' THEN 1 ELSE 0 END,
      saves_count = saves_count + CASE WHEN NEW.engagement_type = 'save' THEN 1 ELSE 0 END,
      views_count = views_count + CASE WHEN NEW.engagement_type = 'view' THEN 1 ELSE 0 END
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.posts SET
      likes_count = GREATEST(0, likes_count - CASE WHEN OLD.engagement_type = 'like' THEN 1 ELSE 0 END),
      comments_count = GREATEST(0, comments_count - CASE WHEN OLD.engagement_type = 'comment' THEN 1 ELSE 0 END),
      shares_count = GREATEST(0, shares_count - CASE WHEN OLD.engagement_type = 'share' THEN 1 ELSE 0 END),
      saves_count = GREATEST(0, saves_count - CASE WHEN OLD.engagement_type = 'save' THEN 1 ELSE 0 END)
    WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER trigger_update_engagement_counts
  AFTER INSERT OR DELETE ON public.post_engagements
  FOR EACH ROW EXECUTE FUNCTION public.update_post_engagement_counts();

-- Enable realtime for posts
ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;
