-- Watchlist table for users to save content
CREATE TABLE public.watchlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content_id integer NOT NULL,
  content_type text NOT NULL CHECK (content_type IN ('movie', 'tv')),
  added_at timestamp with time zone DEFAULT now() NOT NULL,
  UNIQUE (user_id, content_id, content_type)
);

ALTER TABLE public.watchlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own watchlist"
ON public.watchlists FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can add to their own watchlist"
ON public.watchlists FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can remove from their own watchlist"
ON public.watchlists FOR DELETE
USING (user_id = auth.uid());

-- Ratings and reviews table
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content_id integer NOT NULL,
  content_type text NOT NULL CHECK (content_type IN ('movie', 'tv')),
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 10),
  review_text text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  is_approved boolean DEFAULT true,
  UNIQUE (user_id, content_id, content_type)
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved reviews"
ON public.reviews FOR SELECT
USING (is_approved = true OR user_id = auth.uid());

CREATE POLICY "Users can create their own reviews"
ON public.reviews FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own reviews"
ON public.reviews FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own reviews"
ON public.reviews FOR DELETE
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all reviews"
ON public.reviews FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Featured content managed by admins
CREATE TABLE public.featured_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id integer NOT NULL,
  content_type text NOT NULL CHECK (content_type IN ('movie', 'tv')),
  title text NOT NULL,
  description text,
  poster_path text,
  backdrop_path text,
  priority integer DEFAULT 0,
  is_active boolean DEFAULT true,
  start_date timestamp with time zone DEFAULT now(),
  end_date timestamp with time zone,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.featured_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active featured content"
ON public.featured_content FOR SELECT
USING (is_active = true AND (end_date IS NULL OR end_date > now()));

CREATE POLICY "Admins can manage featured content"
ON public.featured_content FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- User follows for social features
CREATE TABLE public.user_follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  following_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  UNIQUE (follower_id, following_id),
  CHECK (follower_id != following_id)
);

ALTER TABLE public.user_follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view follows"
ON public.user_follows FOR SELECT
USING (true);

CREATE POLICY "Users can follow others"
ON public.user_follows FOR INSERT
WITH CHECK (follower_id = auth.uid());

CREATE POLICY "Users can unfollow"
ON public.user_follows FOR DELETE
USING (follower_id = auth.uid());

-- Content reports for moderation
CREATE TABLE public.content_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  content_type text NOT NULL CHECK (content_type IN ('review', 'user')),
  content_id uuid NOT NULL,
  reason text NOT NULL,
  description text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  reviewed_by uuid REFERENCES auth.users(id),
  reviewed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.content_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create reports"
ON public.content_reports FOR INSERT
WITH CHECK (reporter_id = auth.uid());

CREATE POLICY "Users can view their own reports"
ON public.content_reports FOR SELECT
USING (reporter_id = auth.uid() OR has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'moderator'));

CREATE POLICY "Admins and moderators can update reports"
ON public.content_reports FOR UPDATE
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'moderator'));

-- User bans table
CREATE TABLE public.user_bans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  banned_by uuid REFERENCES auth.users(id),
  reason text NOT NULL,
  banned_at timestamp with time zone DEFAULT now() NOT NULL,
  expires_at timestamp with time zone,
  is_permanent boolean DEFAULT false,
  UNIQUE (user_id)
);

ALTER TABLE public.user_bans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage bans"
ON public.user_bans FOR ALL
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can see if they are banned"
ON public.user_bans FOR SELECT
USING (user_id = auth.uid());

-- Activity logs for admin analytics
CREATE TABLE public.activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  details jsonb,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all logs"
ON public.activity_logs FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert logs"
ON public.activity_logs FOR INSERT
WITH CHECK (true);

-- Add trigger for reviews updated_at
CREATE TRIGGER update_reviews_updated_at
BEFORE UPDATE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add theme preference to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS theme_preference text DEFAULT 'dark' CHECK (theme_preference IN ('light', 'dark', 'system'));