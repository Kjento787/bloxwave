import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { HeroBanner } from "@/components/HeroBanner";
import { MovieCarousel } from "@/components/MovieCarousel";
import { GenreButtons } from "@/components/GenreButtons";
import { Footer } from "@/components/Footer";
import { LoadingSpinner, HeroBannerSkeleton } from "@/components/LoadingSpinner";
import {
  fetchTrendingMovies,
  fetchPopularMovies,
  fetchTopRatedMovies,
  fetchUpcomingMovies,
  fetchNowPlayingMovies,
  fetchGenres,
  Movie,
} from "@/lib/tmdb";
import { getContinueWatching, WatchProgress } from "@/lib/watchHistory";
import { History, Flame, Star, Clock, Film } from "lucide-react";

const Index = () => {
  const [continueWatching, setContinueWatching] = useState<WatchProgress[]>([]);

  useEffect(() => {
    setContinueWatching(getContinueWatching());
  }, []);

  const { data: trendingData, isLoading: trendingLoading } = useQuery({
    queryKey: ["trending"],
    queryFn: () => fetchTrendingMovies("week"),
  });

  const { data: popularData } = useQuery({
    queryKey: ["popular"],
    queryFn: () => fetchPopularMovies(),
  });

  const { data: topRatedData } = useQuery({
    queryKey: ["topRated"],
    queryFn: () => fetchTopRatedMovies(),
  });

  const { data: upcomingData } = useQuery({
    queryKey: ["upcoming"],
    queryFn: () => fetchUpcomingMovies(),
  });

  const { data: nowPlayingData } = useQuery({
    queryKey: ["nowPlaying"],
    queryFn: () => fetchNowPlayingMovies(),
  });

  const { data: genresData } = useQuery({
    queryKey: ["genres"],
    queryFn: fetchGenres,
  });

  const continueWatchingMovies: Movie[] = continueWatching.map((item) => ({
    id: item.movieId,
    title: item.title,
    poster_path: item.posterPath,
    backdrop_path: item.backdropPath,
    overview: "",
    release_date: "",
    vote_average: 0,
    vote_count: 0,
    genre_ids: [],
    popularity: 0,
    adult: false,
    original_language: "",
  }));

  const progressData = continueWatching.reduce(
    (acc, item) => ({ ...acc, [item.movieId]: item.progress }),
    {} as Record<number, number>
  );

  if (trendingLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <HeroBannerSkeleton />
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* Hero Banner - Full Screen with Overlap */}
      {trendingData?.results && <HeroBanner movies={trendingData.results} />}

      {/* Main Content - Overlapping Hero with negative margin */}
      <main className="relative z-10 -mt-32 md:-mt-48 lg:-mt-56">
        {/* Genre Quick Access */}
        {genresData?.genres && (
          <section className="px-4 md:px-8 lg:px-12 mb-6 md:mb-8">
            <h2 className="text-base md:text-lg font-semibold mb-3 text-foreground/80">Browse by Genre</h2>
            <GenreButtons genres={genresData.genres} />
          </section>
        )}

        {/* Content Rows Container */}
        <div className="space-y-6 md:space-y-8 lg:space-y-10">
          {/* Continue Watching */}
          {continueWatchingMovies.length > 0 && (
            <MovieCarousel
              title="Continue Watching"
              movies={continueWatchingMovies}
              showProgress
              progressData={progressData}
              icon={<History className="h-5 w-5 text-primary" />}
            />
          )}

          {/* Now Playing */}
          {nowPlayingData?.results && (
            <MovieCarousel 
              title="Now Playing" 
              movies={nowPlayingData.results}
              icon={<Film className="h-5 w-5 text-primary" />}
            />
          )}

          {/* Popular */}
          {popularData?.results && (
            <MovieCarousel 
              title="Popular Right Now" 
              movies={popularData.results}
              icon={<Flame className="h-5 w-5 text-primary" />}
            />
          )}

          {/* Top Rated */}
          {topRatedData?.results && (
            <MovieCarousel 
              title="Top Rated" 
              movies={topRatedData.results}
              icon={<Star className="h-5 w-5 text-primary" />}
            />
          )}

          {/* Upcoming */}
          {upcomingData?.results && (
            <MovieCarousel 
              title="Coming Soon" 
              movies={upcomingData.results}
              icon={<Clock className="h-5 w-5 text-primary" />}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
