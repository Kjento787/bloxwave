import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Genre } from "@/lib/tmdb";
import { cn } from "@/lib/utils";

interface SearchFiltersProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: FilterState) => void;
  genres: Genre[];
  className?: string;
}

export interface FilterState {
  sortBy: string;
  year: string;
  genre: string;
  rating: string;
}

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

const sortOptions = [
  { value: "popularity.desc", label: "Most Popular" },
  { value: "vote_average.desc", label: "Highest Rated" },
  { value: "release_date.desc", label: "Newest First" },
  { value: "release_date.asc", label: "Oldest First" },
  { value: "revenue.desc", label: "Highest Revenue" },
];

const ratingOptions = [
  { value: "all", label: "Any Rating" },
  { value: "9", label: "9+ Stars" },
  { value: "8", label: "8+ Stars" },
  { value: "7", label: "7+ Stars" },
  { value: "6", label: "6+ Stars" },
];

export const SearchFilters = ({
  onSearch,
  onFilterChange,
  genres,
  className,
}: SearchFiltersProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    sortBy: "popularity.desc",
    year: "all",
    genre: "all",
    rating: "all",
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const updateFilter = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    // Convert "all" back to empty string for API calls
    const apiFilters = {
      ...newFilters,
      year: newFilters.year === "all" ? "" : newFilters.year,
      genre: newFilters.genre === "all" ? "" : newFilters.genre,
      rating: newFilters.rating === "all" ? "" : newFilters.rating,
    };
    onFilterChange(apiFilters);
  };

  const clearFilters = () => {
    const defaultFilters: FilterState = {
      sortBy: "popularity.desc",
      year: "all",
      genre: "all",
      rating: "all",
    };
    setFilters(defaultFilters);
    onFilterChange({
      sortBy: "popularity.desc",
      year: "",
      genre: "",
      rating: "",
    });
  };

  const hasActiveFilters =
    filters.year !== "all" || filters.genre !== "all" || filters.rating !== "all" || filters.sortBy !== "popularity.desc";

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search movies, actors, directors..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 pr-24 h-14 text-lg bg-secondary/50 border-border focus:border-primary rounded-xl"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
          <Button
            type="button"
            variant={showFilters ? "default" : "secondary"}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="h-10"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
          </Button>
        </div>
      </form>

      {/* Filter Panel */}
      {showFilters && (
        <div className="p-4 rounded-xl bg-card border border-border animate-scale-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Filters</h3>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Sort By */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Sort By</label>
              <Select value={filters.sortBy} onValueChange={(v) => updateFilter("sortBy", v)}>
                <SelectTrigger className="bg-secondary/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Year */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Year</label>
              <Select value={filters.year} onValueChange={(v) => updateFilter("year", v)}>
                <SelectTrigger className="bg-secondary/50">
                  <SelectValue placeholder="Any Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Year</SelectItem>
                  {years.map((year) => (
                    <SelectItem key={year} value={String(year)}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Genre */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Genre</label>
              <Select value={filters.genre} onValueChange={(v) => updateFilter("genre", v)}>
                <SelectTrigger className="bg-secondary/50">
                  <SelectValue placeholder="All Genres" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genres</SelectItem>
                  {genres.map((genre) => (
                    <SelectItem key={genre.id} value={String(genre.id)}>
                      {genre.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Rating */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Min Rating</label>
              <Select value={filters.rating} onValueChange={(v) => updateFilter("rating", v)}>
                <SelectTrigger className="bg-secondary/50">
                  <SelectValue placeholder="Any Rating" />
                </SelectTrigger>
                <SelectContent>
                  {ratingOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
