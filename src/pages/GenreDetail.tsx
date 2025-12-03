import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MovieCard } from "@/components/MovieCard";
import { LoadingSpinner, MovieCardSkeleton } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { fetchGenres, fetchMoviesByGenre } from "@/lib/tmdb";

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/genres" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-4">
            <ChevronLeft className="h-4 w-4 mr-1" />
            All Genres
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {genre?.name || "Genre"} Movies
          </h1>
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
              <div className="flex items-center justify-center gap-4 mt-8">
                <Button
                  variant="secondary"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="text-muted-foreground">
                  Page {page} of {Math.min(moviesData.total_pages, 500)}
                </span>
                <Button
                  variant="secondary"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= Math.min(moviesData.total_pages, 500)}
                >
                  Next
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
