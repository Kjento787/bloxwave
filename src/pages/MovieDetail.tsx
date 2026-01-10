import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Play,
  Star,
  Clock,
  Calendar,
  ChevronLeft,
  Film,
  X,
  AlertTriangle,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MovieCarousel } from "@/components/MovieCarousel";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ReviewSection } from "@/components/ReviewSection";
import { TMDBReviews } from "@/components/TMDBReviews";
import { WatchlistButton } from "@/components/WatchlistButton";
import { VideoPlayer } from "@/components/VideoPlayer";
import { AgeVerificationDialog } from "@/components/AgeVerificationDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  fetchMovieDetails,
  fetchSimilarMovies,
  getImageUrl,
} from "@/lib/tmdb";
import { getMovieProgress } from "@/lib/watchHistory";
import { supabase } from "@/integrations/supabase/client";

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const movieId = parseInt(id || "0");
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAgeVerification, setShowAgeVerification] = useState(false);

  const { data: movie, isLoading } = useQuery({
    queryKey: ["movie", movieId],
    queryFn: () => fetchMovieDetails(movieId),
    enabled: !!movieId,
  });

  const { data: similarData } = useQuery({
    queryKey: ["similar", movieId],
    queryFn: () => fetchSimilarMovies(movieId),
    enabled: !!movieId,
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session?.user);
    });
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [movieId]);

  const handlePlay = () => {
    // Check if content is adult-rated (18+)
    if (movie?.adult) {
      setShowAgeVerification(true);
    } else {
      setIsPlaying(true);
    }
  };

  const handleAgeConfirm = () => {
    setShowAgeVerification(false);
    setIsPlaying(true);
  };

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center pt-32">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center pt-32">
          <h1 className="text-2xl font-bold mb-4">Movie Not Found</h1>
          <Link to="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const trailer = movie.videos?.results.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  );
  const director = movie.credits?.crew.find((c) => c.job === "Director");
  const cast = movie.credits?.cast.slice(0, 8) || [];
  const progress = getMovieProgress(movieId);
  const progressPercent = progress?.progress || 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Age Verification Dialog */}
      <AgeVerificationDialog
        open={showAgeVerification}
        onConfirm={handleAgeConfirm}
        onCancel={() => setShowAgeVerification(false)}
        title={movie.title}
      />

      {/* Video Player with Ad Blocking & Server Selection */}
      {isPlaying && (
        <VideoPlayer
          contentId={movie.id}
          contentType="movie"
          title={movie.title}
          onClose={() => setIsPlaying(false)}
        />
      )}

      {/* Trailer Modal - uses YouTube directly */}
      {showTrailer && trailer && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col">
          <div className="flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm border-b border-border/50">
            <h2 className="text-lg font-semibold">{movie.title} - Trailer</h2>
            <Button variant="glass" size="icon" onClick={() => setShowTrailer(false)}>
              <X className="h-6 w-6" />
            </Button>
          </div>
          <div className="flex-1 w-full">
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
              className="w-full h-full"
              allowFullScreen
              allow="autoplay; fullscreen"
            />
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative min-h-[70vh] pt-20">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={getImageUrl(movie.backdrop_path, "original")}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
        </div>

        {/* Content */}
        <div className="relative container mx-auto px-4 py-12 flex flex-col lg:flex-row gap-8">
          {/* Poster */}
          <div className="flex-shrink-0">
            <img
              src={getImageUrl(movie.poster_path, "w500")}
              alt={movie.title}
              className="w-64 mx-auto lg:mx-0 rounded-xl shadow-card"
            />
          </div>

          {/* Info */}
          <div className="flex-1 space-y-6">
            <Link
              to="/"
              className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Link>

            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-5xl font-bold">{movie.title}</h1>
                {movie.adult && (
                  <Badge variant="destructive" className="gap-1 text-sm">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    18+
                  </Badge>
                )}
              </div>
              {movie.tagline && (
                <p className="text-lg text-muted-foreground italic">
                  "{movie.tagline}"
                </p>
              )}
            </div>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="font-semibold">{movie.vote_average.toFixed(1)}</span>
                <span className="text-muted-foreground">
                  ({movie.vote_count.toLocaleString()} votes)
                </span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {movie.release_date?.split("-")[0]}
              </div>
              {movie.runtime && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {formatRuntime(movie.runtime)}
                </div>
              )}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <Link key={genre.id} to={`/genre/${genre.id}`}>
                  <Badge variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-colors">
                    {genre.name}
                  </Badge>
                </Link>
              ))}
            </div>

            {/* Overview */}
            <p className="text-foreground/90 leading-relaxed max-w-2xl">
              {movie.overview}
            </p>

            {/* Progress Bar */}
            {progressPercent > 0 && (
              <div className="max-w-md">
                <div className="flex justify-between text-sm text-muted-foreground mb-1">
                  <span>Continue watching</span>
                  <span>{Math.round(progressPercent)}% complete</span>
                </div>
                <div className="h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-4">
              <Button size="lg" variant="hero" onClick={handlePlay}>
                <Play className="h-5 w-5 fill-current" />
                {progressPercent > 0 ? "Continue Watching" : "Watch Now"}
              </Button>
              {trailer && (
                <Button size="lg" variant="outline" onClick={() => setShowTrailer(true)}>
                  <Film className="h-5 w-5" />
                  Watch Trailer
                </Button>
              )}
              {isAuthenticated && (
                <WatchlistButton
                  contentId={movieId}
                  contentType="movie"
                  size="lg"
                  variant="glass"
                />
              )}
            </div>

            {/* Director */}
            {director && (
              <div>
                <span className="text-muted-foreground">Directed by </span>
                <span className="font-semibold">{director.name}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Cast */}
      {cast.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-6">Cast</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {cast.map((person) => (
              <div key={person.id} className="text-center">
                <div className="aspect-square rounded-full overflow-hidden bg-muted mb-2">
                  {person.profile_path ? (
                    <img
                      src={getImageUrl(person.profile_path, "w200")}
                      alt={person.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      No Image
                    </div>
                  )}
                </div>
                <p className="font-medium text-sm line-clamp-1">{person.name}</p>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {person.character}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TMDB Reviews */}
      <section className="container mx-auto px-4 py-12">
        <TMDBReviews contentId={movieId} contentType="movie" />
      </section>

      {/* User Reviews Section */}
      <section className="container mx-auto px-4 py-12 border-t border-border/30">
        <ReviewSection
          contentId={movieId}
          contentType="movie"
          isAuthenticated={isAuthenticated}
        />
      </section>

      {/* Similar Movies */}
      {similarData?.results && similarData.results.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <MovieCarousel title="Similar Movies" movies={similarData.results} />
        </section>
      )}

      <Footer />
    </div>
  );
};

export default MovieDetail;
