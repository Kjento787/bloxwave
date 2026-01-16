import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldX, Clock, Ban, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useBanStatus } from '@/hooks/useBanStatus';
import { format } from 'date-fns';

const Banned = () => {
  const navigate = useNavigate();
  const { isBanned, reason, expiresAt, isPermanent, isLoading } = useBanStatus();

  useEffect(() => {
    // If not banned, redirect to home
    if (!isLoading && !isBanned) {
      navigate('/');
    }
  }, [isBanned, isLoading, navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-destructive/5 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-destructive/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-destructive/5 rounded-full blur-2xl animate-pulse delay-1000" />
      </div>
      
      <Card className="relative max-w-lg w-full bg-card/80 backdrop-blur-xl border-destructive/20 shadow-2xl">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 relative">
            <div className="absolute inset-0 bg-destructive/20 rounded-full blur-xl animate-pulse" />
            <div className="relative bg-destructive/10 p-6 rounded-full">
              <ShieldX className="w-16 h-16 text-destructive" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Account Suspended</h1>
          <p className="text-muted-foreground mt-2">
            Your account has been suspended from accessing this platform
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Ban Reason */}
          <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Ban className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">Reason for Suspension</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {reason || 'No reason provided'}
                </p>
              </div>
            </div>
          </div>

          {/* Ban Duration */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">Duration</h3>
                {isPermanent ? (
                  <p className="text-destructive text-sm font-medium">
                    This suspension is permanent
                  </p>
                ) : expiresAt ? (
                  <p className="text-muted-foreground text-sm">
                    Expires on{' '}
                    <span className="text-foreground font-medium">
                      {format(new Date(expiresAt), 'MMMM d, yyyy \'at\' h:mm a')}
                    </span>
                  </p>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    Duration not specified
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Appeal Info */}
          <div className="text-center text-sm text-muted-foreground">
            <p>
              If you believe this was a mistake, please contact support for assistance.
            </p>
          </div>

          {/* Sign Out Button */}
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="w-full border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Banned;
