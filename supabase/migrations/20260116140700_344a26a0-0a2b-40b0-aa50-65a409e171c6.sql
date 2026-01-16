-- Add IP address column to user_bans table
ALTER TABLE public.user_bans 
ADD COLUMN ip_address text;

-- Create index for faster IP lookups
CREATE INDEX idx_user_bans_ip_address ON public.user_bans(ip_address);

-- Create a table to track IP bans separately (for when we want to ban an IP without a user)
CREATE TABLE public.ip_bans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address text NOT NULL,
  reason text NOT NULL,
  banned_by uuid REFERENCES auth.users(id),
  banned_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz,
  is_permanent boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create unique constraint on IP
CREATE UNIQUE INDEX idx_ip_bans_unique_ip ON public.ip_bans(ip_address);

-- Enable RLS
ALTER TABLE public.ip_bans ENABLE ROW LEVEL SECURITY;

-- Only admins can manage IP bans
CREATE POLICY "Admins can manage IP bans"
ON public.ip_bans
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow public read for checking (via edge function with service role)
CREATE POLICY "Service role can read IP bans"
ON public.ip_bans
FOR SELECT
USING (true);