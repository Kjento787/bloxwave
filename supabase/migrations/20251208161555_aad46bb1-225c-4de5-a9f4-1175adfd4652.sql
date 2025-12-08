-- Drop the overly permissive SELECT policy
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create a new policy: users can only see their own full profile
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (id = auth.uid());

-- Create a public view for non-sensitive profile data (no email)
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT id, display_name, avatar_url, created_at
FROM public.profiles;

-- Grant access to the view for authenticated users
GRANT SELECT ON public.public_profiles TO authenticated;
GRANT SELECT ON public.public_profiles TO anon;