-- Add bio column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio text;

-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for avatars
CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create comments table
CREATE TABLE public.comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  content_id integer NOT NULL,
  content_type text NOT NULL,
  comment_text text NOT NULL,
  parent_id uuid REFERENCES public.comments(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on comments
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Comments policies
CREATE POLICY "Anyone can view comments"
ON public.comments FOR SELECT
USING (true);

CREATE POLICY "Users can create comments"
ON public.comments FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own comments"
ON public.comments FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own comments"
ON public.comments FOR DELETE
USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin'));

-- Create user_statistics table for caching stats
CREATE TABLE public.user_statistics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  movies_watched integer DEFAULT 0,
  tv_shows_watched integer DEFAULT 0,
  total_watch_time integer DEFAULT 0,
  reviews_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on user_statistics
ALTER TABLE public.user_statistics ENABLE ROW LEVEL SECURITY;

-- Statistics policies
CREATE POLICY "Anyone can view user statistics"
ON public.user_statistics FOR SELECT
USING (true);

CREATE POLICY "Users can update their own statistics"
ON public.user_statistics FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own statistics"
ON public.user_statistics FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Update public_profiles view to include bio
DROP VIEW IF EXISTS public.public_profiles;
CREATE VIEW public.public_profiles AS
SELECT 
  id,
  display_name,
  avatar_url,
  bio,
  created_at
FROM public.profiles;

-- Trigger for comments updated_at
CREATE TRIGGER update_comments_updated_at
BEFORE UPDATE ON public.comments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for user_statistics updated_at
CREATE TRIGGER update_user_statistics_updated_at
BEFORE UPDATE ON public.user_statistics
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();