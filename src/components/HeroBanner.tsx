import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Play, Info, ChevronLeft, ChevronRight } from "lucide-react";
import { Movie, getImageUrl } from "@/lib/tmdb";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";

interface HeroBannerProps {
  movies: Movie[];
}

export const HeroBanner = ({ movies }: HeroBannerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const featuredMovies = movies.slice(0, 5);
  const currentMovie = featuredMovies[currentIndex];

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
  }, [featuredMovies.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length);
  }, [featuredMovies.length]);

  // Auto-advance timer
  useEffect(() => {
    const timer = setInterval(goToNext, 8000);
    return () => clearInterval(timer);
  }, [goToNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev]);

  if (!currentMovie) return null;

  return (
    <section className="relative h-[70vh] md:h-[85vh] overflow-hidden group">
      {/* Background Images */}
      {featuredMovies.map((movie, index) => (
        <div
          key={movie.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            index === currentIndex ? "opacity-100" : "opacity-0"
          )}
        >
          <img
            src={getImageUrl(movie.backdrop_path, "original")}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
        </div>
      ))}

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-2xl animate-slide-up">
            {/* Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
              {currentMovie.title}
            </h1>

            {/* Meta */}
            <div className="flex items-center gap-3 mb-4 text-sm">
              <Badge variant="secondary" className="gap-1 bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
                <span>★</span>
                {currentMovie.vote_average.toFixed(1)}
              </Badge>
              <Badge variant="outline">
                {currentMovie.release_date?.split("-")[0]}
              </Badge>
              {currentMovie.adult && (
                <Badge variant="destructive">18+</Badge>
              )}
            </div>

            {/* Overview */}
            <p className="text-base md:text-lg text-foreground/80 mb-8 line-clamp-3 md:line-clamp-4">
              {currentMovie.overview}
            </p>

            {/* Actions */}
            <div className="flex flex-wrap gap-4">
              <Link to={`/movie/${currentMovie.id}`}>
                <Button size="xl" variant="hero">
                  <Play className="h-5 w-5 fill-current" />
                  Watch Now
                </Button>
              </Link>
              <Link to={`/movie/${currentMovie.id}`}>
                <Button size="xl" variant="glass">
                  <Info className="h-5 w-5" />
                  More Info
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {featuredMovies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              index === currentIndex
                ? "bg-primary w-8"
                : "bg-foreground/30 hover:bg-foreground/50"
            )}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="glass"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full hidden md:flex opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-110"
        onClick={goToPrev}
        aria-label="Previous movie"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="glass"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full hidden md:flex opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-110"
        onClick={goToNext}
        aria-label="Next movie"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
    </section>
  );
};
