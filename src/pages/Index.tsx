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

  // Convert continue watching to Movie format
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
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Banner */}
      {trendingData?.results && <HeroBanner movies={trendingData.results} />}

      {/* Main Content */}
      <div className="container mx-auto -mt-32 relative z-10 space-y-12 pb-8">
        {/* Genre Quick Access */}
        {genresData?.genres && (
          <section className="px-4 md:px-0">
            <h2 className="text-xl md:text-2xl font-bold mb-4">Browse by Genre</h2>
            <GenreButtons genres={genresData.genres} />
          </section>
        )}

        {/* Continue Watching */}
        {continueWatchingMovies.length > 0 && (
          <MovieCarousel
            title="Continue Watching"
            movies={continueWatchingMovies}
            showProgress
            progressData={progressData}
          />
        )}

        {/* Now Playing */}
        {nowPlayingData?.results && (
          <MovieCarousel title="Now Playing" movies={nowPlayingData.results} />
        )}

        {/* Popular */}
        {popularData?.results && (
          <MovieCarousel title="Popular Right Now" movies={popularData.results} />
        )}

        {/* Top Rated */}
        {topRatedData?.results && (
          <MovieCarousel title="Top Rated" movies={topRatedData.results} />
        )}

        {/* Upcoming */}
        {upcomingData?.results && (
          <MovieCarousel title="Coming Soon" movies={upcomingData.results} />
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Index;
