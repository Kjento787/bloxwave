import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Play, Star } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MovieCard } from "@/components/MovieCard";
import { MovieCardSkeleton } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchGenres, fetchMoviesByGenre, getImageUrl } from "@/lib/tmdb";
import { cn } from "@/lib/utils";

const GenreDetail = () => {
  const { id } = useParams<{ id: string }>();
  const genreId = parseInt(id || "0");
  const [page, setPage] = useState(1);

  const { data: genresData } = useQuery({
    queryKey: ["genres"],
    queryFn: fetchGenres,
  });

  const { data: moviesData, isLoading } = useQuery({
    queryKey: ["genreMovies", genreId, page],
    queryFn: () => fetchMoviesByGenre(genreId, page),
    enabled: !!genreId,
  });

  const genre = genresData?.genres.find((g) => g.id === genreId);
  const featuredMovie = page === 1 ? moviesData?.results[0] : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Featured Hero */}
      {featuredMovie && (
        <section className="relative h-[50vh] min-h-[400px]">
          <div className="absolute inset-0">
            <img
              src={getImageUrl(featuredMovie.backdrop_path, "original")}
              alt={featuredMovie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
          </div>

          <div className="relative container mx-auto px-4 md:px-8 lg:px-12 h-full flex items-end pb-12">
            <div className="max-w-2xl space-y-4">
              {/* Back Link */}
              <Link 
                to="/genres" 
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors glass px-4 py-2 rounded-full"
              >
                <ChevronLeft className="h-4 w-4" />
                All Genres
              </Link>

              <div className="flex items-center gap-3">
                <Badge className="bg-primary/20 text-primary border-primary/30 px-3 py-1">
                  {genre?.name}
                </Badge>
                {featuredMovie.vote_average && (
                  <Badge variant="outline" className="gap-1">
                    <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                    {featuredMovie.vote_average.toFixed(1)}
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-shadow-lg">
                {featuredMovie.title}
              </h1>

              <p className="text-foreground/80 line-clamp-2">
                {featuredMovie.overview}
              </p>

              <Link to={`/movie/${featuredMovie.id}`}>
                <Button size="lg" className="rounded-lg gap-2 h-12 px-8">
                  <Play className="h-5 w-5 fill-current" />
                  Watch Now
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      <main className={cn(
        "container mx-auto px-4 md:px-8 lg:px-12 pb-12",
        featuredMovie ? "-mt-8 relative z-10" : "pt-24"
      )}>
        {/* Header */}
        <div className="mb-8">
          {!featuredMovie && (
            <Link 
              to="/genres" 
              className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-4"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              All Genres
            </Link>
          )}
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            {genre?.name || "Genre"} Movies
          </h2>
          {moviesData && (
            <p className="text-muted-foreground">
              {moviesData.total_results.toLocaleString()} movies found
            </p>
          )}
        </div>

        {/* Movies Grid */}
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
                  {Array.from({ length: Math.min(5, Math.min(moviesData.total_pages, 500)) }, (_, i) => {
                    let pageNum: number;
                    const maxPage = Math.min(moviesData.total_pages, 500);
                    if (maxPage <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= maxPage - 2) {
                      pageNum = maxPage - 4 + i;
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

export default GenreDetail;
