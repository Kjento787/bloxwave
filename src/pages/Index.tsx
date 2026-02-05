import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { HeroBanner } from "@/components/HeroBanner";
import { Footer } from "@/components/Footer";
import { LoadingSpinner, HeroBannerSkeleton } from "@/components/LoadingSpinner";
import {
  fetchTrendingMovies,
  fetchPopularMovies,
  fetchTopRatedMovies,
  fetchUpcomingMovies,
  fetchNowPlayingMovies,
  fetchTrendingAll,
  fetchTrendingTV,
  discoverMovies,
  discoverTV,
} from "@/lib/tmdb";
import { getContinueWatching, WatchProgress } from "@/lib/watchHistory";
import { 
  History, 
  Flame, 
  Star, 
  Tv,
  Swords,
  Laugh,
  Ghost,
  Rocket,
  Heart,
  Sparkles
} from "lucide-react";

// Components
import { Top10Row } from "@/components/home/Top10Row";
import { HubSection } from "@/components/home/HubSection";
import { SpotlightBanner } from "@/components/home/SpotlightBanner";
import { MoodBrowser } from "@/components/home/MoodBrowser";
import { NewReleasesRow } from "@/components/home/NewReleasesRow";
import { LeavingSoonRow } from "@/components/home/LeavingSoonRow";
import { PreviewCarousel } from "@/components/home/PreviewCarousel";
import { MovieCarousel } from "@/components/MovieCarousel";
import { Recommendations } from "@/components/Recommendations";
import { PageTransition } from "@/components/PageTransition";
import { Movie } from "@/lib/tmdb";

const Index = () => {
  const [continueWatching, setContinueWatching] = useState<WatchProgress[]>([]);

  useEffect(() => {
    setContinueWatching(getContinueWatching());
  }, []);

  // Core data
  const { data: trendingData, isLoading: trendingLoading } = useQuery({
    queryKey: ["trending"],
    queryFn: () => fetchTrendingMovies("week"),
  });

  const { data: trendingAllData } = useQuery({
    queryKey: ["trending-all"],
    queryFn: () => fetchTrendingAll("day"),
  });

  const { data: trendingTVData } = useQuery({
    queryKey: ["trending-tv"],
    queryFn: () => fetchTrendingTV("week"),
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

  // Genre-specific hubs
  const { data: actionData } = useQuery({
    queryKey: ["discover-action"],
    queryFn: () => discoverMovies({ withGenres: "28", sortBy: "popularity.desc" }),
  });

  const { data: comedyData } = useQuery({
    queryKey: ["discover-comedy"],
    queryFn: () => discoverMovies({ withGenres: "35", sortBy: "popularity.desc" }),
  });

  const { data: horrorData } = useQuery({
    queryKey: ["discover-horror"],
    queryFn: () => discoverMovies({ withGenres: "27", sortBy: "popularity.desc" }),
  });

  const { data: scifiData } = useQuery({
    queryKey: ["discover-scifi"],
    queryFn: () => discoverMovies({ withGenres: "878", sortBy: "popularity.desc" }),
  });

  const { data: romanceData } = useQuery({
    queryKey: ["discover-romance"],
    queryFn: () => discoverMovies({ withGenres: "10749", sortBy: "popularity.desc" }),
  });

  const { data: animeData } = useQuery({
    queryKey: ["discover-anime"],
    queryFn: () => discoverTV({ withGenres: "16", sortBy: "popularity.desc" }),
  });

  // Continue watching movies
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

  // Get a spotlight movie from popular data (different from hero)
  const spotlightMovie = popularData?.results?.[5];
  const spotlightMovie2 = topRatedData?.results?.[3];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background overflow-x-hidden">
        <Navbar />

        {/* Hero Banner */}
        {trendingData?.results && <HeroBanner movies={trendingData.results} />}

        {/* Main Content */}
        <main className="relative z-10 -mt-24 md:-mt-32 lg:-mt-40 space-y-8 md:space-y-10 lg:space-y-12">
          
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

          {/* Personalized Recommendations */}
          <Recommendations />

          {/* Top 10 Trending */}
          {trendingAllData?.results && (
            <Top10Row 
              title="in Your Country Today" 
              movies={trendingAllData.results} 
            />
          )}

          {/* Mood Browser */}
          <MoodBrowser />

          {/* Just Added */}
          {nowPlayingData?.results && (
            <NewReleasesRow 
              title="Just Added" 
              movies={nowPlayingData.results} 
            />
          )}

          {/* Spotlight Banner 1 */}
          {spotlightMovie && (
            <SpotlightBanner 
              movie={spotlightMovie} 
              label="Spotlight" 
            />
          )}

          {/* Popular */}
          {popularData?.results && (
            <PreviewCarousel
              title="Popular Right Now"
              movies={popularData.results}
              icon={<Flame className="h-5 w-5 text-orange-500" />}
            />
          )}

          {/* Action Hub */}
          {actionData?.results && (
            <HubSection
              title="Action Hub"
              icon={Swords}
              movies={actionData.results}
              genreId={28}
              accentColor="hsl(0, 84%, 60%)"
            />
          )}

          {/* Trending TV Shows */}
          {trendingTVData?.results && (
            <PreviewCarousel
              title="Trending TV Shows"
              movies={trendingTVData.results}
              icon={<Tv className="h-5 w-5 text-blue-500" />}
            />
          )}

          {/* Comedy Hub */}
          {comedyData?.results && (
            <HubSection
              title="Comedy Hub"
              icon={Laugh}
              movies={comedyData.results}
              genreId={35}
              accentColor="hsl(45, 93%, 47%)"
            />
          )}

          {/* Spotlight Banner 2 */}
          {spotlightMovie2 && (
            <SpotlightBanner 
              movie={spotlightMovie2} 
              label="Editor's Pick" 
            />
          )}

          {/* Top Rated */}
          {topRatedData?.results && (
            <PreviewCarousel
              title="Critically Acclaimed"
              movies={topRatedData.results}
              icon={<Star className="h-5 w-5 text-yellow-500" />}
            />
          )}

          {/* Horror Hub */}
          {horrorData?.results && (
            <HubSection
              title="Horror Hub"
              icon={Ghost}
              movies={horrorData.results}
              genreId={27}
              accentColor="hsl(270, 50%, 40%)"
            />
          )}

          {/* Sci-Fi Hub */}
          {scifiData?.results && (
            <HubSection
              title="Sci-Fi Hub"
              icon={Rocket}
              movies={scifiData.results}
              genreId={878}
              accentColor="hsl(200, 100%, 50%)"
            />
          )}

          {/* Leaving Soon with Live Countdowns */}
          {topRatedData?.results && (
            <LeavingSoonRow 
              title="Last Chance to Watch" 
              movies={topRatedData.results.slice(10, 20)} 
            />
          )}

          {/* Romance Hub */}
          {romanceData?.results && (
            <HubSection
              title="Romance Hub"
              icon={Heart}
              movies={romanceData.results}
              genreId={10749}
              accentColor="hsl(340, 82%, 52%)"
            />
          )}

          {/* Anime Hub */}
          {animeData?.results && (
            <HubSection
              title="Anime Hub"
              icon={Sparkles}
              movies={animeData.results}
              searchQuery="anime"
              accentColor="hsl(280, 100%, 60%)"
            />
          )}

          {/* Coming Soon */}
          {upcomingData?.results && (
            <MovieCarousel
              title="Coming Soon"
              movies={upcomingData.results}
              icon={<Sparkles className="h-5 w-5 text-primary" />}
            />
          )}

        </main>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default Index;