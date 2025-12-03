import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MovieCard } from "@/components/MovieCard";
import { SearchFilters, FilterState } from "@/components/SearchFilters";
import { LoadingSpinner, MovieCardSkeleton } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { searchMovies, fetchGenres, discoverMovies } from "@/lib/tmdb";
import { Search as SearchIcon } from "lucide-react";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(initialQuery);
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

  const { data: moviesData, isLoading } = useQuery({
    queryKey: ["search", searchQuery, filters, page],
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
    enabled: !!searchQuery || Object.values(filters).some((v) => v),
  });

  useEffect(() => {
    if (initialQuery && initialQuery !== searchQuery) {
      setSearchQuery(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
    if (query) {
      setSearchParams({ q: query });
    } else {
      setSearchParams({});
    }
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Search</h1>
          <p className="text-muted-foreground">
            Find your next favorite movie
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
        {!searchQuery && !Object.values(filters).some((v) => v) ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <SearchIcon className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Start Searching</h2>
            <p className="text-muted-foreground max-w-md">
              Enter a search term or use the filters to discover movies
            </p>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 18 }).map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            {searchQuery && (
              <p className="text-muted-foreground mb-4">
                Showing results for "{searchQuery}" ({moviesData?.total_results || 0} found)
              </p>
            )}

            {moviesData?.results.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <h2 className="text-xl font-semibold mb-2">No Results Found</h2>
                <p className="text-muted-foreground max-w-md">
                  Try adjusting your search terms or filters
                </p>
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
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Search;
