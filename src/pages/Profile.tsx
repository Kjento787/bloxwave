import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Clock, Bookmark, Trash2, Play, Settings, Loader2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfileSettings } from "@/components/ProfileSettings";
import { UserStatistics } from "@/components/UserStatistics";
import { FollowStats } from "@/components/FollowStats";
import { Recommendations } from "@/components/Recommendations";
import {
  getContinueWatching,
  removeWatchProgress,
  WatchProgress,
} from "@/lib/watchHistory";
import { getImageUrl, fetchMovieDetails, fetchTVDetails } from "@/lib/tmdb";
import { useProfile } from "@/hooks/useProfile";
import { useWatchlist } from "@/hooks/useWatchlist";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface WatchlistItemWithDetails {
  id: string;
  content_id: number;
  content_type: "movie" | "tv";
  added_at: string;
  title: string;
  poster_path: string | null;
}

const Profile = () => {
  const navigate = useNavigate();
  const { profile, loading: profileLoading, userId } = useProfile();
  const { watchlist, isLoading: watchlistLoading, removeFromWatchlist } = useWatchlist();
  const [continueWatching, setContinueWatching] = useState<WatchProgress[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session?.user);
      if (!session?.user) {
        navigate('/auth');
      }
    };
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    setContinueWatching(getContinueWatching());
  }, []);

  // Fetch details for all watchlist items
  const { data: watchlistWithDetails = [], isLoading: detailsLoading } = useQuery({
    queryKey: ["watchlist-details", watchlist],
    queryFn: async () => {
      if (!watchlist || watchlist.length === 0) return [];
      
      const details = await Promise.all(
        watchlist.map(async (item) => {
          try {
            if (item.content_type === "movie") {
              const data = await fetchMovieDetails(item.content_id);
              return {
                ...item,
                title: data.title || "Unknown",
                poster_path: data.poster_path,
              };
            } else {
              const data = await fetchTVDetails(item.content_id);
              return {
                ...item,
                title: data.name || "Unknown",
                poster_path: data.poster_path,
              };
            }
          } catch {
            return {
              ...item,
              title: "Unknown",
              poster_path: null,
            };
          }
        })
      );
      return details as WatchlistItemWithDetails[];
    },
    enabled: !!watchlist && watchlist.length > 0,
  });

  const handleRemoveProgress = (movieId: number) => {
    removeWatchProgress(movieId);
    setContinueWatching(getContinueWatching());
  };

  const handleRemoveFromList = (contentId: number, contentType: "movie" | "tv") => {
    removeFromWatchlist.mutate({ contentId, contentType });
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (!isAuthenticated) {
    return null;
  }

  const isWatchlistLoading = watchlistLoading || detailsLoading;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-8 p-8 rounded-2xl bg-gradient-hero border border-border">
          <Avatar className="w-24 h-24 border-2 border-primary/50">
            <AvatarImage src={profile?.avatar_url || undefined} alt="Profile" />
            <AvatarFallback className="bg-primary/20">
              <User className="h-12 w-12 text-primary" />
            </AvatarFallback>
          </Avatar>
          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-bold mb-1">
              {profile?.display_name || 'My Profile'}
            </h1>
            {profile?.bio && (
              <p className="text-muted-foreground mb-3 max-w-lg">{profile.bio}</p>
            )}
            {userId && <FollowStats userId={userId} />}
          </div>
        </div>

        {/* User Statistics */}
        <div className="mb-8">
          <UserStatistics />
        </div>

        {/* Recommendations */}
        <div className="mb-8">
          <Recommendations />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="continue" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="continue" className="gap-2">
              <Clock className="h-4 w-4" />
              Continue Watching ({continueWatching.length})
            </TabsTrigger>
            <TabsTrigger value="watchlist" className="gap-2">
              <Bookmark className="h-4 w-4" />
              My List {isWatchlistLoading ? "" : `(${watchlistWithDetails.length})`}
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Continue Watching */}
          <TabsContent value="continue" className="space-y-4">
            {continueWatching.length === 0 ? (
              <div className="text-center py-12 px-4 rounded-xl bg-card border border-border">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No movies in progress</h3>
                <p className="text-muted-foreground mb-4">
                  Start watching movies and they'll appear here
                </p>
                <Link to="/movies">
                  <Button>Browse Movies</Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-4">
                {continueWatching.map((item) => (
                  <div
                    key={item.movieId}
                    className="flex gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors group"
                  >
                    {/* Thumbnail */}
                    <Link to={`/movie/${item.movieId}`} className="flex-shrink-0">
                      <div className="w-24 md:w-32 aspect-video rounded-lg overflow-hidden bg-muted">
                        {item.backdropPath ? (
                          <img
                            src={getImageUrl(item.backdropPath, "w300")}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : item.posterPath ? (
                          <img
                            src={getImageUrl(item.posterPath, "w200")}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                            No Image
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link to={`/movie/${item.movieId}`}>
                        <h3 className="font-semibold hover:text-primary transition-colors line-clamp-1">
                          {item.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatTime(item.currentTime)} watched • {Math.round(item.progress)}% complete
                      </p>

                      {/* Progress Bar */}
                      <div className="mt-3 h-1 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Link to={`/movie/${item.movieId}`}>
                        <Button size="sm" variant="hero">
                          <Play className="h-4 w-4 fill-current" />
                          <span className="hidden sm:inline">Resume</span>
                        </Button>
                      </Link>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemoveProgress(item.movieId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Watch List */}
          <TabsContent value="watchlist" className="space-y-4">
            {isWatchlistLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : watchlistWithDetails.length === 0 ? (
              <div className="text-center py-12 px-4 rounded-xl bg-card border border-border">
                <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Your list is empty</h3>
                <p className="text-muted-foreground mb-4">
                  Add movies or TV shows to your list to watch later
                </p>
                <Link to="/movies">
                  <Button>Browse Movies</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {watchlistWithDetails.map((item) => (
                  <div key={item.id} className="group relative">
                    <Link
                      to={item.content_type === "tv" ? `/tv/${item.content_id}` : `/movie/${item.content_id}`}
                      className="block rounded-xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-all hover:scale-105"
                    >
                      <div className="aspect-[2/3]">
                        {item.poster_path ? (
                          <img
                            src={getImageUrl(item.poster_path, "w300")}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium text-sm line-clamp-1">{item.title}</h3>
                        <p className="text-xs text-muted-foreground">{item.content_type === "tv" ? "TV Show" : "Movie"}</p>
                      </div>
                    </Link>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveFromList(item.content_id, item.content_type)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="max-w-2xl">
              <ProfileSettings />
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
