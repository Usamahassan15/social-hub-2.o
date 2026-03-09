
-- Create violation types enum
CREATE TYPE public.violation_type AS ENUM ('nudity', 'sexual_content', 'explicit_text', 'pornographic', 'adult_services', 'vulgar_content', 'violence', 'other');

-- Create violation status enum
CREATE TYPE public.violation_status AS ENUM ('pending', 'confirmed', 'dismissed');

-- Create ban status enum  
CREATE TYPE public.ban_status AS ENUM ('active', 'expired', 'lifted');

-- Content violations tracking table
CREATE TABLE public.content_violations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  violation_type violation_type NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('image', 'video', 'text', 'comment', 'profile_picture', 'story')),
  content_preview TEXT,
  ai_confidence NUMERIC(5,4),
  status violation_status NOT NULL DEFAULT 'confirmed',
  warning_number INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User bans table
CREATE TABLE public.user_bans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  violation_id UUID REFERENCES public.content_violations(id),
  ban_duration_hours INTEGER NOT NULL,
  ban_status ban_status NOT NULL DEFAULT 'active',
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User warning counter (aggregated view for quick lookup)
CREATE TABLE public.user_moderation_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  total_violations INTEGER NOT NULL DEFAULT 0,
  total_warnings INTEGER NOT NULL DEFAULT 0,
  is_currently_banned BOOLEAN NOT NULL DEFAULT false,
  current_ban_ends_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.content_violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_bans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_moderation_stats ENABLE ROW LEVEL SECURITY;

-- Users can view their own violations
CREATE POLICY "Users can view own violations" ON public.content_violations
  FOR SELECT USING (auth.uid() = user_id);

-- Users can view their own ban status
CREATE POLICY "Users can view own bans" ON public.user_bans
  FOR SELECT USING (auth.uid() = user_id);

-- Users can view their own moderation stats
CREATE POLICY "Users can view own moderation stats" ON public.user_moderation_stats
  FOR SELECT USING (auth.uid() = user_id);

-- Service role (edge functions) can do everything via service_role key
-- No additional insert/update policies needed for regular users - only edge functions insert

-- Create function to check if user is currently banned
CREATE OR REPLACE FUNCTION public.is_user_banned(check_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_bans
    WHERE user_id = check_user_id
      AND ban_status = 'active'
      AND ends_at > now()
  )
$$;

-- Create function to get user violation count
CREATE OR REPLACE FUNCTION public.get_user_violation_count(check_user_id UUID)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(total_violations, 0)
  FROM public.user_moderation_stats
  WHERE user_id = check_user_id
$$;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_moderation_stats_updated_at
  BEFORE UPDATE ON public.user_moderation_stats
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes for performance
CREATE INDEX idx_violations_user_id ON public.content_violations(user_id);
CREATE INDEX idx_violations_created_at ON public.content_violations(created_at DESC);
CREATE INDEX idx_bans_user_id ON public.user_bans(user_id);
CREATE INDEX idx_bans_active ON public.user_bans(user_id, ban_status, ends_at) WHERE ban_status = 'active';
CREATE INDEX idx_moderation_stats_user ON public.user_moderation_stats(user_id);
