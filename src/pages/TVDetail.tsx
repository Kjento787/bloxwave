import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Play,
  Star,
  Clock,
  Calendar,
  ChevronLeft,
  Tv,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MovieCarousel } from "@/components/MovieCarousel";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ReviewSection } from "@/components/ReviewSection";
import { TMDBReviews } from "@/components/TMDBReviews";
import { WatchlistButton } from "@/components/WatchlistButton";
import { VideoPlayer } from "@/components/VideoPlayer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  fetchTVDetails,
  fetchSimilarTV,
  getImageUrl,
  getEmbedUrl,
} from "@/lib/tmdb";
import { supabase } from "@/integrations/supabase/client";

const TVDetail = () => {
  const { id } = useParams<{ id: string }>();
  const tvId = parseInt(id || "0");
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { data: tvShow, isLoading } = useQuery({
    queryKey: ["tv", tvId],
    queryFn: () => fetchTVDetails(tvId),
    enabled: !!tvId,
  });

  const { data: similarData } = useQuery({
    queryKey: ["similarTV", tvId],
    queryFn: () => fetchSimilarTV(tvId),
    enabled: !!tvId,
  });

  // Check authentication
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session?.user);
    });
  }, []);

  // Initialize season when TV show data loads
  useEffect(() => {
    if (tvShow?.seasons && tvShow.seasons.length > 0) {
      const validSeasons = tvShow.seasons.filter(s => s.season_number > 0);
      if (validSeasons.length > 0 && selectedSeason === null) {
        setSelectedSeason(validSeasons[0].season_number);
        setSelectedEpisode(1);
      }
    }
  }, [tvShow, selectedSeason]);

  // Reset episode when season changes
  const handleSeasonChange = (newSeason: number) => {
    if (newSeason !== selectedSeason) {
      setSelectedSeason(newSeason);
      setSelectedEpisode(1);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [tvId]);

  const handlePlay = () => {
    setIsPlaying(true);
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

  if (!tvShow) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center pt-32">
          <h1 className="text-2xl font-bold mb-4">TV Show Not Found</h1>
          <Link to="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const trailer = tvShow.videos?.results.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  );
  const creator = tvShow.credits?.crew.find((c) => c.job === "Creator" || c.job === "Executive Producer");
  const cast = tvShow.credits?.cast.slice(0, 8) || [];
  const currentSeason = tvShow.seasons?.find(s => s.season_number === selectedSeason);
  const episodeCount = currentSeason?.episode_count || 10;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Video Player with Ad Blocking */}
      {isPlaying && (
        <VideoPlayer
          embedUrl={getEmbedUrl(tvShow.id, "tv", selectedSeason || 1, selectedEpisode)}
          title={tvShow.name}
          subtitle={`Season ${selectedSeason}, Episode ${selectedEpisode}`}
          onClose={() => setIsPlaying(false)}
        />
      )}

      {/* Trailer Modal */}
      {showTrailer && trailer && (
        <VideoPlayer
          embedUrl={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
          title={`${tvShow.name} - Trailer`}
          onClose={() => setShowTrailer(false)}
        />
      )}

      {/* Hero Section */}
      <section className="relative min-h-[70vh] pt-20">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={getImageUrl(tvShow.backdrop_path, "original")}
            alt={tvShow.name}
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
              src={getImageUrl(tvShow.poster_path, "w500")}
              alt={tvShow.name}
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
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="gap-1">
                  <Tv className="h-3 w-3" />
                  TV Series
                </Badge>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-2">{tvShow.name}</h1>
              {tvShow.tagline && (
                <p className="text-lg text-muted-foreground italic">
                  "{tvShow.tagline}"
                </p>
              )}
            </div>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="font-semibold">{tvShow.vote_average.toFixed(1)}</span>
                <span className="text-muted-foreground">
                  ({tvShow.vote_count.toLocaleString()} votes)
                </span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {tvShow.first_air_date?.split("-")[0]}
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-4 w-4" />
                {tvShow.number_of_seasons} Season{tvShow.number_of_seasons !== 1 ? 's' : ''}
              </div>
              <div className="text-muted-foreground">
                {tvShow.number_of_episodes} Episodes
              </div>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2">
              {tvShow.genres.map((genre) => (
                <Badge key={genre.id} variant="secondary">
                  {genre.name}
                </Badge>
              ))}
            </div>

            {/* Overview */}
            <p className="text-foreground/90 leading-relaxed max-w-2xl">
              {tvShow.overview}
            </p>

            {/* Season/Episode Selector */}
            <div className="flex flex-wrap gap-4 sm:gap-6 items-center">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-sm sm:text-base tv:text-lg text-muted-foreground">Season:</span>
                <Select value={String(selectedSeason || 1)} onValueChange={(v) => handleSeasonChange(Number(v))}>
                  <SelectTrigger className="w-20 sm:w-24 tv:w-32 h-10 sm:h-11 tv:h-14 text-sm sm:text-base tv:text-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tvShow.seasons?.filter(s => s.season_number > 0).map((season) => (
                      <SelectItem key={season.id} value={String(season.season_number)} className="tv:text-lg tv:py-3">
                        {season.season_number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-sm sm:text-base tv:text-lg text-muted-foreground">Episode:</span>
                <Select value={String(selectedEpisode)} onValueChange={(v) => setSelectedEpisode(Number(v))}>
                  <SelectTrigger className="w-20 sm:w-24 tv:w-32 h-10 sm:h-11 tv:h-14 text-sm sm:text-base tv:text-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 tv:max-h-80">
                    {Array.from({ length: episodeCount }, (_, i) => i + 1).map((ep) => (
                      <SelectItem key={ep} value={String(ep)} className="tv:text-lg tv:py-3">
                        {ep}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4">
              <Button size="lg" variant="hero" onClick={handlePlay}>
                <Play className="h-5 w-5 fill-current" />
                Watch S{selectedSeason}E{selectedEpisode}
              </Button>
              {trailer && (
                <Button size="lg" variant="outline" onClick={() => setShowTrailer(true)}>
                  <Tv className="h-5 w-5" />
                  Watch Trailer
                </Button>
              )}
              {isAuthenticated && (
                <WatchlistButton
                  contentId={tvId}
                  contentType="tv"
                  size="lg"
                  variant="glass"
                />
              )}
            </div>

            {/* Creator */}
            {creator && (
              <div>
                <span className="text-muted-foreground">Created by </span>
                <span className="font-semibold">{creator.name}</span>
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
        <TMDBReviews contentId={tvId} contentType="tv" />
      </section>

      {/* User Reviews Section */}
      <section className="container mx-auto px-4 py-12 border-t border-border/30">
        <ReviewSection
          contentId={tvId}
          contentType="tv"
          isAuthenticated={isAuthenticated}
        />
      </section>

      {/* Similar Shows */}
      {similarData?.results && similarData.results.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <MovieCarousel title="Similar Shows" movies={similarData.results} />
        </section>
      )}

      <Footer />
    </div>
  );
};

export default TVDetail;
