import { Link } from "react-router-dom";
import { useQuery, useQueries } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { fetchGenres, fetchMoviesByGenre, getImageUrl, Genre } from "@/lib/tmdb";
import {
  Sword,
  Laugh,
  Film,
  Ghost,
  Heart,
  Wand2,
  Rocket,
  History,
  Music2,
  Search,
  Skull,
  Sparkles,
  Tv,
  Shield,
  Bomb,
} from "lucide-react";

const genreIcons: Record<number, React.ElementType> = {
  28: Bomb,
  12: Sword,
  16: Sparkles,
  35: Laugh,
  80: Shield,
  99: Film,
  18: Tv,
  10751: Heart,
  14: Wand2,
  36: History,
  27: Ghost,
  10402: Music2,
  9648: Search,
  10749: Heart,
  878: Rocket,
  53: Skull,
  10752: Bomb,
  37: Sword,
};

const genreColors: Record<number, string> = {
  28: "from-red-500/20 to-orange-500/20",
  12: "from-emerald-500/20 to-green-500/20",
  16: "from-pink-500/20 to-purple-500/20",
  35: "from-yellow-500/20 to-amber-500/20",
  80: "from-slate-500/20 to-gray-500/20",
  99: "from-blue-500/20 to-cyan-500/20",
  18: "from-violet-500/20 to-purple-500/20",
  10751: "from-pink-500/20 to-rose-500/20",
  14: "from-indigo-500/20 to-blue-500/20",
  36: "from-amber-500/20 to-yellow-500/20",
  27: "from-gray-500/20 to-slate-500/20",
  10402: "from-fuchsia-500/20 to-pink-500/20",
  9648: "from-teal-500/20 to-cyan-500/20",
  10749: "from-rose-500/20 to-pink-500/20",
  878: "from-cyan-500/20 to-blue-500/20",
  53: "from-red-500/20 to-rose-500/20",
  10752: "from-stone-500/20 to-gray-500/20",
  37: "from-orange-500/20 to-amber-500/20",
};

const Genres = () => {
  const { data: genresData, isLoading: genresLoading } = useQuery({
    queryKey: ["genres"],
    queryFn: fetchGenres,
  });

  const genres = genresData?.genres || [];

  // Fetch movie data for all genres using useQueries
  const genreMoviesQueries = useQueries({
    queries: genres.map((genre) => ({
      queryKey: ["genreMovies", genre.id],
      queryFn: () => fetchMoviesByGenre(genre.id, 1),
      enabled: genres.length > 0,
    })),
  });

  if (genresLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center pt-32">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Genres</h1>
          <p className="text-muted-foreground">
            Explore movies by your favorite genres
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {genres.map((genre, index) => {
            const Icon = genreIcons[genre.id] || Film;
            const gradientColor = genreColors[genre.id] || "from-primary/20 to-accent/20";
            const queryResult = genreMoviesQueries[index];
            const backdrop = queryResult?.data?.results[0]?.backdrop_path;
            const totalResults = queryResult?.data?.total_results;

            return (
              <Link
                key={genre.id}
                to={`/genre/${genre.id}`}
                className="group relative h-40 rounded-xl overflow-hidden bg-card border border-border hover:border-primary transition-all duration-300 hover:scale-[1.02]"
              >
                {/* Background Image */}
                {backdrop && (
                  <img
                    src={getImageUrl(backdrop, "w780")}
                    alt={genre.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity duration-300"
                  />
                )}

                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${gradientColor}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent" />

                {/* Content */}
                <div className="relative h-full flex flex-col items-center justify-center p-6">
                  <Icon className="h-10 w-10 text-primary mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-xl font-bold text-center">{genre.name}</h3>
                  {totalResults && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {totalResults.toLocaleString()} movies
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Genres;
