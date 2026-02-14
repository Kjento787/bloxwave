
-- Create viewer_profiles table for Netflix-style profile selection
CREATE TABLE public.viewer_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  is_kids BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.viewer_profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own viewer profiles
CREATE POLICY "Users can view own viewer profiles"
ON public.viewer_profiles FOR SELECT
USING (user_id = auth.uid());

-- Users can create their own viewer profiles (max enforced in app)
CREATE POLICY "Users can create own viewer profiles"
ON public.viewer_profiles FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users can update their own viewer profiles
CREATE POLICY "Users can update own viewer profiles"
ON public.viewer_profiles FOR UPDATE
USING (user_id = auth.uid());

-- Users can delete their own viewer profiles
CREATE POLICY "Users can delete own viewer profiles"
ON public.viewer_profiles FOR DELETE
USING (user_id = auth.uid());

-- Trigger for updated_at
CREATE TRIGGER update_viewer_profiles_updated_at
BEFORE UPDATE ON public.viewer_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
