import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Play, Info, ChevronLeft, ChevronRight, Star, Calendar, TrendingUp } from "lucide-react";
import { Movie, getImageUrl } from "@/lib/tmdb";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";

interface HeroBannerProps {
  movies: Movie[];
}

export const HeroBanner = ({ movies }: HeroBannerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const featuredMovies = movies.slice(0, 5);
  const currentMovie = featuredMovies[currentIndex];

  const goToNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
    setTimeout(() => setIsTransitioning(false), 800);
  }, [featuredMovies.length, isTransitioning]);

  const goToPrev = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length);
    setTimeout(() => setIsTransitioning(false), 800);
  }, [featuredMovies.length, isTransitioning]);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 800);
  }, [isTransitioning, currentIndex]);

  // Auto-advance timer
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(goToNext, 8000);
    return () => clearInterval(timer);
  }, [goToNext, isPaused]);

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
    <section 
      className="relative h-[75vh] md:h-[90vh] overflow-hidden group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Images with Ken Burns Effect */}
      {featuredMovies.map((movie, index) => (
        <div
          key={movie.id}
          className={cn(
            "absolute inset-0 transition-all duration-1000 ease-out",
            index === currentIndex 
              ? "opacity-100 scale-100" 
              : "opacity-0 scale-105"
          )}
        >
          <img
            src={getImageUrl(movie.backdrop_path, "original")}
            alt={movie.title}
            className={cn(
              "w-full h-full object-cover transition-transform duration-[8000ms] ease-linear",
              index === currentIndex && "scale-110"
            )}
          />
          {/* Multi-layer Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        </div>
      ))}

      {/* Animated Background Accent */}
      <div className="absolute inset-0 bg-gradient-hero opacity-30 mix-blend-overlay" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4 md:px-8">
          <div 
            key={currentMovie.id}
            className="max-w-2xl animate-slide-up"
          >
            {/* Trending Badge */}
            <div className="flex items-center gap-2 mb-4">
              <Badge 
                variant="secondary" 
                className="gap-1.5 bg-primary/20 text-primary border-primary/30 backdrop-blur-sm animate-fade-in"
              >
                <TrendingUp className="h-3.5 w-3.5" />
                #{currentIndex + 1} Trending
              </Badge>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight text-shadow-lg">
              {currentMovie.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <Badge 
                variant="secondary" 
                className="gap-1.5 bg-yellow-500/20 text-yellow-400 border-yellow-500/30 backdrop-blur-sm"
              >
                <Star className="h-3.5 w-3.5 fill-current" />
                {currentMovie.vote_average.toFixed(1)}
              </Badge>
              {currentMovie.release_date && (
                <Badge variant="outline" className="gap-1.5 backdrop-blur-sm border-white/20">
                  <Calendar className="h-3.5 w-3.5" />
                  {currentMovie.release_date.split("-")[0]}
                </Badge>
              )}
              {currentMovie.adult && (
                <Badge variant="destructive" className="backdrop-blur-sm">18+</Badge>
              )}
            </div>

            {/* Overview */}
            <p className="text-base md:text-lg text-foreground/80 mb-8 line-clamp-3 md:line-clamp-4 leading-relaxed">
              {currentMovie.overview}
            </p>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <Link to={`/movie/${currentMovie.id}`}>
                <Button 
                  size="xl" 
                  variant="hero"
                  className="shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105"
                >
                  <Play className="h-5 w-5 fill-current" />
                  Watch Now
                </Button>
              </Link>
              <Link to={`/movie/${currentMovie.id}`}>
                <Button 
                  size="xl" 
                  variant="glass"
                  className="hover:bg-white/20 transition-all duration-300 hover:scale-105"
                >
                  <Info className="h-5 w-5" />
                  More Info
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Dots - Redesigned */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3">
        {featuredMovies.map((movie, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "relative overflow-hidden rounded-full transition-all duration-500",
              index === currentIndex
                ? "w-12 h-3 bg-primary"
                : "w-3 h-3 bg-foreground/30 hover:bg-foreground/50"
            )}
            aria-label={`Go to slide ${index + 1}: ${movie.title}`}
          >
            {index === currentIndex && (
              <span 
                className="absolute inset-0 bg-primary/50 origin-left animate-progress"
                style={{ animationDuration: isPaused ? '999999s' : '8s' }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Mini Preview Cards */}
      <div className="absolute bottom-24 right-8 hidden lg:flex gap-2">
        {featuredMovies.map((movie, index) => (
          <button
            key={movie.id}
            onClick={() => goToSlide(index)}
            className={cn(
              "relative w-20 h-12 rounded-lg overflow-hidden transition-all duration-300",
              index === currentIndex
                ? "ring-2 ring-primary scale-110 z-10"
                : "opacity-50 hover:opacity-80 hover:scale-105"
            )}
          >
            <img
              src={getImageUrl(movie.backdrop_path, "w300")}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="glass"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 h-14 w-14 rounded-full hidden md:flex opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-white/20"
        onClick={goToPrev}
        aria-label="Previous movie"
      >
        <ChevronLeft className="h-7 w-7" />
      </Button>
      <Button
        variant="glass"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 h-14 w-14 rounded-full hidden md:flex opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-white/20"
        onClick={goToNext}
        aria-label="Next movie"
      >
        <ChevronRight className="h-7 w-7" />
      </Button>
    </section>
  );
};
