
-- Add new violation types
ALTER TYPE public.violation_type ADD VALUE IF NOT EXISTS 'scam';
ALTER TYPE public.violation_type ADD VALUE IF NOT EXISTS 'phishing';
ALTER TYPE public.violation_type ADD VALUE IF NOT EXISTS 'hate_speech';
ALTER TYPE public.violation_type ADD VALUE IF NOT EXISTS 'harassment';
ALTER TYPE public.violation_type ADD VALUE IF NOT EXISTS 'spam';
ALTER TYPE public.violation_type ADD VALUE IF NOT EXISTS 'unsafe_link';
ALTER TYPE public.violation_type ADD VALUE IF NOT EXISTS 'bot_activity';
ALTER TYPE public.violation_type ADD VALUE IF NOT EXISTS 'copyright';

-- Report status enum
CREATE TYPE public.report_status AS ENUM ('pending', 'reviewed', 'resolved', 'dismissed');
CREATE TYPE public.report_reason AS ENUM ('spam', 'harassment', 'scam', 'adult_content', 'fake_account', 'hate_speech', 'violence', 'copyright', 'other');

-- User trust scores table
CREATE TABLE public.user_trust_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  trust_score INTEGER NOT NULL DEFAULT 50,
  verified_email BOOLEAN NOT NULL DEFAULT false,
  verified_phone BOOLEAN NOT NULL DEFAULT false,
  account_age_days INTEGER NOT NULL DEFAULT 0,
  positive_interactions INTEGER NOT NULL DEFAULT 0,
  negative_interactions INTEGER NOT NULL DEFAULT 0,
  spam_score INTEGER NOT NULL DEFAULT 0,
  is_restricted BOOLEAN NOT NULL DEFAULT false,
  restriction_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.user_trust_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own trust score"
  ON public.user_trust_scores FOR SELECT
  USING (auth.uid() = user_id);

-- Spam tracking table
CREATE TABLE public.spam_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  action_type TEXT NOT NULL,
  content_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.spam_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own spam tracking"
  ON public.spam_tracking FOR SELECT
  USING (auth.uid() = user_id);

-- User reports table
CREATE TABLE public.user_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID NOT NULL,
  reported_user_id UUID,
  reported_content_id TEXT,
  report_reason report_reason NOT NULL,
  description TEXT,
  evidence_url TEXT,
  status report_status NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.user_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reports"
  ON public.user_reports FOR SELECT
  USING (auth.uid() = reporter_id);

CREATE POLICY "Users can create reports"
  ON public.user_reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

-- Triggers for updated_at
CREATE TRIGGER update_user_trust_scores_updated_at
  BEFORE UPDATE ON public.user_trust_scores
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_reports_updated_at
  BEFORE UPDATE ON public.user_reports
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to calculate trust score
CREATE OR REPLACE FUNCTION public.calculate_trust_score(check_user_id UUID)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT GREATEST(0, LEAST(100,
    50
    + CASE WHEN ts.verified_email THEN 10 ELSE 0 END
    + CASE WHEN ts.verified_phone THEN 15 ELSE 0 END
    + LEAST(ts.account_age_days / 30, 10)
    + LEAST(ts.positive_interactions / 5, 10)
    - (ts.negative_interactions * 5)
    - (ts.spam_score * 3)
    - (COALESCE(ms.total_violations, 0) * 10)
  ))
  FROM public.user_trust_scores ts
  LEFT JOIN public.user_moderation_stats ms ON ms.user_id = ts.user_id
  WHERE ts.user_id = check_user_id
$$;

-- Function to check spam rate
CREATE OR REPLACE FUNCTION public.check_spam_rate(check_user_id UUID, action TEXT, minutes INTEGER DEFAULT 5)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::INTEGER
  FROM public.spam_tracking
  WHERE user_id = check_user_id
    AND action_type = action
    AND created_at > now() - (minutes || ' minutes')::interval
$$;
