import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface BanStatus {
  isBanned: boolean;
  reason: string | null;
  expiresAt: string | null;
  isPermanent: boolean;
  isLoading: boolean;
}

export const useBanStatus = () => {
  const [banStatus, setBanStatus] = useState<BanStatus>({
    isBanned: false,
    reason: null,
    expiresAt: null,
    isPermanent: false,
    isLoading: true,
  });

  useEffect(() => {
    const checkBanStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setBanStatus(prev => ({ ...prev, isLoading: false }));
        return;
      }

      const { data: ban, error } = await supabase
        .from('user_bans')
        .select('*')
        .eq('user_id', user.id)
        .order('banned_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error checking ban status:', error);
        setBanStatus(prev => ({ ...prev, isLoading: false }));
        return;
      }

      if (ban) {
        // Check if ban is still active
        const isExpired = ban.expires_at && new Date(ban.expires_at) < new Date();
        const isActive = !isExpired || ban.is_permanent;

        setBanStatus({
          isBanned: isActive,
          reason: ban.reason,
          expiresAt: ban.expires_at,
          isPermanent: ban.is_permanent || false,
          isLoading: false,
        });
      } else {
        setBanStatus({
          isBanned: false,
          reason: null,
          expiresAt: null,
          isPermanent: false,
          isLoading: false,
        });
      }
    };

    checkBanStatus();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkBanStatus();
    });

    return () => subscription.unsubscribe();
  }, []);

  return banStatus;
};
