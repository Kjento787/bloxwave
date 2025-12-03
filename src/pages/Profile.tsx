import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { User, Clock, Bookmark, Trash2, Play } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getContinueWatching,
  getWatchList,
  removeFromWatchList,
  removeWatchProgress,
  WatchProgress,
  WatchList as WatchListType,
} from "@/lib/watchHistory";
import { getImageUrl } from "@/lib/tmdb";
import { cn } from "@/lib/utils";

const Profile = () => {
  const [continueWatching, setContinueWatching] = useState<WatchProgress[]>([]);
  const [watchList, setWatchList] = useState<WatchListType[]>([]);

  useEffect(() => {
    setContinueWatching(getContinueWatching());
    setWatchList(getWatchList());
  }, []);

  const handleRemoveProgress = (movieId: number) => {
    removeWatchProgress(movieId);
    setContinueWatching(getContinueWatching());
  };

  const handleRemoveFromList = (movieId: number) => {
    removeFromWatchList(movieId);
    setWatchList(getWatchList());
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-12 p-8 rounded-2xl bg-gradient-hero border border-border">
          <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="h-12 w-12 text-primary" />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold mb-2">My Profile</h1>
            <p className="text-muted-foreground">
              Track your movies and manage your watchlist
            </p>
          </div>
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
              My List ({watchList.length})
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
            {watchList.length === 0 ? (
              <div className="text-center py-12 px-4 rounded-xl bg-card border border-border">
                <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Your list is empty</h3>
                <p className="text-muted-foreground mb-4">
                  Add movies to your list to watch later
                </p>
                <Link to="/movies">
                  <Button>Browse Movies</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {watchList.map((item) => (
                  <div key={item.movieId} className="group relative">
                    <Link
                      to={`/movie/${item.movieId}`}
                      className="block rounded-xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-all hover:scale-105"
                    >
                      <div className="aspect-[2/3]">
                        {item.posterPath ? (
                          <img
                            src={getImageUrl(item.posterPath, "w300")}
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
                      </div>
                    </Link>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveFromList(item.movieId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
