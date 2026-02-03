import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  User, 
  Clock, 
  Bookmark, 
  Trash2, 
  Play, 
  Settings, 
  Loader2,
  Film,
  Tv,
  Star,
  TrendingUp,
  Calendar,
  Edit3,
  Grid3X3,
  LayoutList,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { cn } from "@/lib/utils";

interface WatchlistItemWithDetails {
  id: string;
  content_id: number;
  content_type: "movie" | "tv";
  added_at: string;
  title: string;
  poster_path: string | null;
  vote_average?: number;
  year?: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { profile, loading: profileLoading, userId } = useProfile();
  const { watchlist, isLoading: watchlistLoading, removeFromWatchlist } = useWatchlist();
  const [continueWatching, setContinueWatching] = useState<WatchProgress[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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
                vote_average: data.vote_average,
                year: data.release_date?.split("-")[0],
              };
            } else {
              const data = await fetchTVDetails(item.content_id);
              return {
                ...item,
                title: data.name || "Unknown",
                poster_path: data.poster_path,
                vote_average: data.vote_average,
                year: data.first_air_date?.split("-")[0],
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

      {/* Hero Profile Header */}
      <section className="relative pt-20 pb-32">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

        <div className="relative container mx-auto px-4 md:px-8 lg:px-12">
          <div className="flex flex-col md:flex-row items-center gap-8 py-12">
            {/* Avatar */}
            <div className="relative group">
              <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-primary/30 shadow-glow">
                <AvatarImage src={profile?.avatar_url || undefined} alt="Profile" />
                <AvatarFallback className="bg-gradient-purple text-4xl font-bold">
                  {profile?.display_name?.[0]?.toUpperCase() || <User className="h-16 w-16" />}
                </AvatarFallback>
              </Avatar>
              <Link 
                to="#settings"
                className="absolute bottom-2 right-2 p-2 rounded-full bg-primary text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Edit3 className="h-4 w-4" />
              </Link>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black">
                  {profile?.display_name || 'My Profile'}
                </h1>
                {profile?.bio && (
                  <p className="text-lg text-muted-foreground mt-2 max-w-xl">
                    {profile.bio}
                  </p>
                )}
              </div>
              
              {userId && <FollowStats userId={userId} />}

              {/* Quick Stats */}
              <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass">
                  <Film className="h-5 w-5 text-primary" />
                  <span className="font-semibold">{continueWatching.length}</span>
                  <span className="text-muted-foreground text-sm">In Progress</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass">
                  <Bookmark className="h-5 w-5 text-primary" />
                  <span className="font-semibold">{watchlistWithDetails.length}</span>
                  <span className="text-muted-foreground text-sm">Saved</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-8 lg:px-12 -mt-20 relative z-10 pb-12">
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <TabsList className="glass h-12 p-1 rounded-xl">
              <TabsTrigger value="continue" className="gap-2 px-4 rounded-lg">
                <Clock className="h-4 w-4" />
                <span className="hidden sm:inline">Continue</span>
                <Badge variant="secondary" className="ml-1">{continueWatching.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="watchlist" className="gap-2 px-4 rounded-lg">
                <Bookmark className="h-4 w-4" />
                <span className="hidden sm:inline">My List</span>
                {!isWatchlistLoading && (
                  <Badge variant="secondary" className="ml-1">{watchlistWithDetails.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2 px-4 rounded-lg">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
            </TabsList>

            {/* View Toggle for Watchlist */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode("grid")}
                className={cn(
                  "h-9 w-9 rounded-lg",
                  viewMode === "grid" && "bg-secondary"
                )}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode("list")}
                className={cn(
                  "h-9 w-9 rounded-lg",
                  viewMode === "list" && "bg-secondary"
                )}
              >
                <LayoutList className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Continue Watching */}
          <TabsContent value="continue" className="space-y-4">
            {continueWatching.length === 0 ? (
              <div className="text-center py-20 px-4 rounded-2xl bg-card border border-border">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Nothing in progress</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Start watching movies and TV shows, and they'll appear here so you can pick up where you left off.
                </p>
                <Link to="/movies">
                  <Button size="lg" className="rounded-xl px-8">
                    Browse Content
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-4">
                {continueWatching.map((item) => (
                  <div
                    key={item.movieId}
                    className="flex gap-4 p-4 rounded-xl bg-card hover:bg-secondary/30 transition-colors group"
                  >
                    <Link to={`/movie/${item.movieId}`} className="flex-shrink-0">
                      <div className="w-32 md:w-40 aspect-video rounded-lg overflow-hidden bg-muted relative">
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
                        {/* Play overlay */}
                        <div className="absolute inset-0 bg-background/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="h-10 w-10 text-foreground fill-current" />
                        </div>
                        {/* Progress bar */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      </div>
                    </Link>

                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <Link to={`/movie/${item.movieId}`}>
                        <h3 className="font-bold text-lg hover:text-primary transition-colors line-clamp-1">
                          {item.title}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span>{formatTime(item.currentTime)} watched</span>
                        <span>•</span>
                        <span>{Math.round(item.progress)}% complete</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link to={`/movie/${item.movieId}`}>
                        <Button className="rounded-lg gap-2">
                          <Play className="h-4 w-4 fill-current" />
                          Resume
                        </Button>
                      </Link>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-10 w-10 text-muted-foreground hover:text-destructive"
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
              <div className="flex justify-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
              </div>
            ) : watchlistWithDetails.length === 0 ? (
              <div className="text-center py-20 px-4 rounded-2xl bg-card border border-border">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bookmark className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Your list is empty</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Save movies and TV shows to your list to watch them later.
                </p>
                <Link to="/movies">
                  <Button size="lg" className="rounded-xl px-8">
                    Browse Content
                  </Button>
                </Link>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {watchlistWithDetails.map((item) => (
                  <div key={item.id} className="group relative">
                    <Link
                      to={item.content_type === "tv" ? `/tv/${item.content_id}` : `/movie/${item.content_id}`}
                      className="block rounded-xl overflow-hidden bg-card transition-all hover:scale-105 hover:shadow-hover"
                    >
                      <div className="aspect-[2/3] relative">
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
                        <div className="absolute top-2 left-2">
                          <Badge className={cn(
                            "text-xs",
                            item.content_type === "tv" 
                              ? "bg-blue-500/80" 
                              : "bg-primary/80"
                          )}>
                            {item.content_type === "tv" ? <Tv className="h-3 w-3 mr-1" /> : <Film className="h-3 w-3 mr-1" />}
                            {item.content_type === "tv" ? "TV" : "Movie"}
                          </Badge>
                        </div>
                        {item.vote_average && (
                          <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 rounded-md bg-background/80 backdrop-blur-sm text-xs font-medium">
                            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                            {item.vote_average.toFixed(1)}
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="font-semibold text-sm line-clamp-1">{item.title}</h3>
                        {item.year && (
                          <p className="text-xs text-muted-foreground mt-1">{item.year}</p>
                        )}
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
            ) : (
              <div className="space-y-3">
                {watchlistWithDetails.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-card hover:bg-secondary/30 transition-colors group"
                  >
                    <Link
                      to={item.content_type === "tv" ? `/tv/${item.content_id}` : `/movie/${item.content_id}`}
                      className="flex-shrink-0"
                    >
                      <div className="w-16 h-24 rounded-lg overflow-hidden bg-muted">
                        {item.poster_path ? (
                          <img
                            src={getImageUrl(item.poster_path, "w200")}
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
                    <div className="flex-1 min-w-0">
                      <Link to={item.content_type === "tv" ? `/tv/${item.content_id}` : `/movie/${item.content_id}`}>
                        <h3 className="font-bold hover:text-primary transition-colors">{item.title}</h3>
                      </Link>
                      <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                        <Badge variant="outline" className="text-xs">
                          {item.content_type === "tv" ? "TV Show" : "Movie"}
                        </Badge>
                        {item.year && <span>{item.year}</span>}
                        {item.vote_average && (
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                            {item.vote_average.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link to={item.content_type === "tv" ? `/tv/${item.content_id}` : `/movie/${item.content_id}`}>
                        <Button className="rounded-lg gap-2">
                          <Play className="h-4 w-4 fill-current" />
                          Watch
                        </Button>
                      </Link>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-10 w-10 text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemoveFromList(item.content_id, item.content_type)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" id="settings">
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
