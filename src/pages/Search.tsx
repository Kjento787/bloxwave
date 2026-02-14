import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MovieCard } from "@/components/MovieCard";
import { SearchFilters, FilterState } from "@/components/SearchFilters";
import { MovieCardSkeleton } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { searchMulti, fetchGenres, discoverMovies } from "@/lib/tmdb";
import { Search as SearchIcon, ChevronLeft, ChevronRight, Film, Tv, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [contentFilter, setContentFilter] = useState<"all" | "movie" | "tv">("all");

  const { data: genresData } = useQuery({
    queryKey: ["genres"],
    queryFn: fetchGenres,
  });

  const { data: moviesData, isLoading } = useQuery({
    queryKey: ["search", searchQuery, filters, page],
    queryFn: () => {
      if (searchQuery) {
        return searchMulti(searchQuery, page);
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

  // Filter results by content type
  const filteredResults = moviesData?.results.filter(item => {
    if (contentFilter === "all") return true;
    return item.media_type === contentFilter;
  }) || [];

  const movieCount = moviesData?.results.filter(r => r.media_type === "movie").length || 0;
  const tvCount = moviesData?.results.filter(r => r.media_type === "tv").length || 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 md:px-8 lg:px-12 pt-24 pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-2 font-display">
            {searchQuery ? (
              <>
                Results for <span className="text-primary">"{searchQuery}"</span>
              </>
            ) : (
              "Search"
            )}
          </h1>
          <p className="text-muted-foreground">
            Find your next favorite movie or TV show
          </p>
        </div>

        {/* Search and Filters */}
        <SearchFilters
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          genres={genresData?.genres || []}
          className="mb-6"
        />

        {/* Content Type Filter */}
        {searchQuery && moviesData?.results && moviesData.results.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant={contentFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setContentFilter("all")}
              className="rounded-full gap-2"
            >
              <Sparkles className="h-4 w-4" />
              All
              <Badge variant="secondary" className="ml-1">{moviesData.results.length}</Badge>
            </Button>
            <Button
              variant={contentFilter === "movie" ? "default" : "outline"}
              size="sm"
              onClick={() => setContentFilter("movie")}
              className="rounded-full gap-2"
            >
              <Film className="h-4 w-4" />
              Movies
              <Badge variant="secondary" className="ml-1">{movieCount}</Badge>
            </Button>
            <Button
              variant={contentFilter === "tv" ? "default" : "outline"}
              size="sm"
              onClick={() => setContentFilter("tv")}
              className="rounded-full gap-2"
            >
              <Tv className="h-4 w-4" />
              TV Shows
              <Badge variant="secondary" className="ml-1">{tvCount}</Badge>
            </Button>
          </div>
        )}

        {/* Results */}
        {!searchQuery && !Object.values(filters).some((v) => v) ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <SearchIcon className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Start Searching</h2>
            <p className="text-muted-foreground max-w-md">
              Enter a search term or use the filters above to discover movies and TV shows
            </p>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 18 }).map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
              <SearchIcon className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-3">No Results Found</h2>
            <p className="text-muted-foreground max-w-md">
              Try adjusting your search terms or filters to find what you're looking for
            </p>
          </div>
        ) : (
          <>
            {searchQuery && (
              <p className="text-muted-foreground mb-6">
                Found {moviesData?.total_results.toLocaleString()} results
              </p>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filteredResults.map((movie) => (
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

export default Search;
