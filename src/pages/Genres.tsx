import { Link } from "react-router-dom";
import { useQuery, useQueries } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { fetchGenres, fetchMoviesByGenre, getImageUrl, Genre } from "@/lib/tmdb";
import { Badge } from "@/components/ui/badge";
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
  Play,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

const genreColors: Record<number, { bg: string; text: string }> = {
  28: { bg: "from-red-600/30 to-orange-600/30", text: "text-red-400" },
  12: { bg: "from-emerald-600/30 to-green-600/30", text: "text-emerald-400" },
  16: { bg: "from-pink-600/30 to-purple-600/30", text: "text-pink-400" },
  35: { bg: "from-yellow-600/30 to-amber-600/30", text: "text-yellow-400" },
  80: { bg: "from-slate-600/30 to-gray-600/30", text: "text-slate-400" },
  99: { bg: "from-blue-600/30 to-cyan-600/30", text: "text-blue-400" },
  18: { bg: "from-violet-600/30 to-purple-600/30", text: "text-violet-400" },
  10751: { bg: "from-pink-600/30 to-rose-600/30", text: "text-pink-400" },
  14: { bg: "from-indigo-600/30 to-blue-600/30", text: "text-indigo-400" },
  36: { bg: "from-amber-600/30 to-yellow-600/30", text: "text-amber-400" },
  27: { bg: "from-gray-600/30 to-slate-600/30", text: "text-gray-400" },
  10402: { bg: "from-fuchsia-600/30 to-pink-600/30", text: "text-fuchsia-400" },
  9648: { bg: "from-teal-600/30 to-cyan-600/30", text: "text-teal-400" },
  10749: { bg: "from-rose-600/30 to-pink-600/30", text: "text-rose-400" },
  878: { bg: "from-cyan-600/30 to-blue-600/30", text: "text-cyan-400" },
  53: { bg: "from-red-600/30 to-rose-600/30", text: "text-red-400" },
  10752: { bg: "from-stone-600/30 to-gray-600/30", text: "text-stone-400" },
  37: { bg: "from-orange-600/30 to-amber-600/30", text: "text-orange-400" },
};

const Genres = () => {
  const { data: genresData, isLoading: genresLoading } = useQuery({
    queryKey: ["genres"],
    queryFn: fetchGenres,
  });

  const genres = genresData?.genres || [];

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

      {/* Hero Header */}
      <section className="pt-24 pb-12 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container mx-auto px-4 md:px-8 lg:px-12 relative">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4">
            Browse by Genre
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Explore movies organized by genre. Find your next favorite film in any category.
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 md:px-8 lg:px-12 pb-12">
        {/* Genre Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {genres.map((genre, index) => {
            const Icon = genreIcons[genre.id] || Film;
            const colors = genreColors[genre.id] || { bg: "from-primary/30 to-accent/30", text: "text-primary" };
            const queryResult = genreMoviesQueries[index];
            const movies = queryResult?.data?.results?.slice(0, 4) || [];
            const totalResults = queryResult?.data?.total_results;

            return (
              <Link
                key={genre.id}
                to={`/genre/${genre.id}`}
                className="group relative rounded-2xl overflow-hidden bg-card hover:scale-[1.02] transition-all duration-300"
              >
                {/* Background Images Collage */}
                <div className="aspect-[16/10] relative">
                  <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-0.5">
                    {movies.slice(0, 4).map((movie, i) => (
                      <div key={movie.id} className="overflow-hidden">
                        <img
                          src={getImageUrl(movie.backdrop_path || movie.poster_path, "w500")}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    ))}
                  </div>
                  
                  {/* Gradient Overlay */}
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-t opacity-90 group-hover:opacity-80 transition-opacity",
                    colors.bg
                  )} />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
                  
                  {/* Content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={cn(
                        "p-2 rounded-lg bg-background/20 backdrop-blur-sm",
                        colors.text
                      )}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{genre.name}</h3>
                        {totalResults && (
                          <p className="text-sm text-foreground/70">
                            {totalResults.toLocaleString()} titles
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* Hover Action */}
                    <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
                      <Badge className="bg-foreground text-background gap-1 px-3 py-1.5">
                        <Play className="h-3 w-3 fill-current" />
                        Explore
                      </Badge>
                    </div>
                  </div>
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
