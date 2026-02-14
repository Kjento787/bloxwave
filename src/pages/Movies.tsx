import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MovieCard } from "@/components/MovieCard";
import { SearchFilters, FilterState } from "@/components/SearchFilters";
import { MovieCardSkeleton } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { discoverMovies, fetchGenres, searchMovies, getImageUrl, fetchTrendingAll } from "@/lib/tmdb";
import { Play, Star, ChevronLeft, ChevronRight, Film, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const Movies = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    sortBy: "popularity.desc",
    year: "",
    genre: "",
    rating: "",
  });
  const [page, setPage] = useState(1);

  const { data: genresData } = useQuery({
    queryKey: ["genres"],
    queryFn: fetchGenres,
  });

  const { data: trendingData } = useQuery({
    queryKey: ["trendingMovies"],
    queryFn: () => fetchTrendingAll(),
  });

  const { data: moviesData, isLoading } = useQuery({
    queryKey: ["discover", filters, page, searchQuery],
    queryFn: () => {
      if (searchQuery) {
        return searchMovies(searchQuery, page);
      }
      return discoverMovies({
        page,
        sortBy: filters.sortBy,
        year: filters.year ? parseInt(filters.year) : undefined,
        withGenres: filters.genre,
        voteAverageGte: filters.rating ? parseInt(filters.rating) : undefined,
      });
    },
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(1);
    setSearchQuery("");
  };

  const featuredMovie = (trendingData as any)?.results?.find((m: any) => m.media_type === "movie" && m.backdrop_path);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Featured Hero */}
      {featuredMovie && !searchQuery && page === 1 && (
        <section className="relative h-[60vh] min-h-[500px]">
          <div className="absolute inset-0">
            <img
              src={getImageUrl(featuredMovie.backdrop_path, "original")}
              alt={featuredMovie.title || featuredMovie.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
          </div>

          <div className="relative container mx-auto px-4 md:px-8 lg:px-12 h-full flex items-end pb-16">
            <div className="max-w-2xl space-y-4">
              <div className="flex items-center gap-3">
                <Badge className="bg-primary/20 text-primary border-primary/30 gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Trending Now
                </Badge>
                {featuredMovie.vote_average && (
                  <Badge variant="outline" className="gap-1">
                    <Star className="h-3 w-3 fill-primary text-primary" />
                    {featuredMovie.vote_average.toFixed(1)}
                  </Badge>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-shadow-lg font-display">
                {featuredMovie.title || featuredMovie.name}
              </h1>
              <p className="text-lg text-foreground/80 line-clamp-2">
                {featuredMovie.overview}
              </p>
              <div className="flex gap-4 pt-2">
                <Link to={`/movie/${featuredMovie.id}`}>
                  <Button size="lg" className="rounded-lg gap-2 h-12 px-8">
                    <Play className="h-5 w-5 fill-current" />
                    Watch Now
                  </Button>
                </Link>
                <Link to={`/movie/${featuredMovie.id}`}>
                  <Button size="lg" variant="outline" className="rounded-lg gap-2 h-12 px-8 glass">
                    <Film className="h-5 w-5" />
                    Details
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <main className={cn(
        "container mx-auto px-4 md:px-8 lg:px-12 pb-12",
        featuredMovie && !searchQuery && page === 1 ? "-mt-8 relative z-10" : "pt-24"
      )}>
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            {searchQuery ? `Results for "${searchQuery}"` : "Explore Movies"}
          </h2>
          <p className="text-muted-foreground">
            {moviesData?.total_results 
              ? `${moviesData.total_results.toLocaleString()} movies found`
              : "Discover and explore thousands of movies"
            }
          </p>
        </div>

        {/* Search and Filters */}
        <SearchFilters
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          genres={genresData?.genres || []}
          className="mb-8"
        />

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 18 }).map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {moviesData?.results.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            {/* Pagination */}
            {moviesData && moviesData.total_pages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-12">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-xl gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(5, moviesData.total_pages) }, (_, i) => {
                    let pageNum: number;
                    if (moviesData.total_pages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= moviesData.total_pages - 2) {
                      pageNum = moviesData.total_pages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }
                    return (
                      <Button
                        key={pageNum}
                        variant={page === pageNum ? "default" : "ghost"}
                        size="icon"
                        onClick={() => setPage(pageNum)}
                        className={cn(
                          "w-10 h-10 rounded-lg",
                          page === pageNum && "bg-primary"
                        )}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= Math.min(moviesData.total_pages, 500)}
                  className="rounded-xl gap-2"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Movies;
