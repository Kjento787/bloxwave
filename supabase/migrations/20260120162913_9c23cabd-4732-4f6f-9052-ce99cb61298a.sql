-- Fix security definer view by using SECURITY INVOKER
DROP VIEW IF EXISTS public.public_profiles;
CREATE VIEW public.public_profiles 
WITH (security_invoker = true) AS
SELECT 
  id,
  display_name,
  avatar_url,
  bio,
  created_at
FROM public.profiles;