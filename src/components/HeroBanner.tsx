import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Play, Info, Star } from "lucide-react";
import { Movie, getImageUrl } from "@/lib/tmdb";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

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

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 800);
  }, [isTransitioning, currentIndex]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(goToNext, 8000);
    return () => clearInterval(timer);
  }, [goToNext, isPaused]);

  if (!currentMovie) return null;

  return (
    <section 
      className="relative h-[85vh] md:h-screen overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Images */}
      {featuredMovies.map((movie, index) => (
        <div
          key={movie.id}
          className={cn(
            "absolute inset-0 transition-all duration-1000 ease-out",
            index === currentIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"
          )}
        >
          <img
            src={getImageUrl(movie.backdrop_path, "original")}
            alt={movie.title}
            className="w-full h-full object-cover object-top"
          />
          
          {/* HBO Max Style Gradients */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="w-full px-4 md:px-8 lg:px-12">
          <div 
            key={currentMovie.id}
            className="max-w-xl lg:max-w-2xl animate-slide-up"
          >
            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black mb-4 leading-[0.95] tracking-tight text-shadow-lg">
              {currentMovie.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
              <div className="flex items-center gap-1 text-yellow-400">
                <Star className="h-4 w-4 fill-current" />
                <span className="font-semibold">{currentMovie.vote_average.toFixed(1)}</span>
              </div>
              {currentMovie.release_date && (
                <span className="text-foreground/70">
                  {currentMovie.release_date.split("-")[0]}
                </span>
              )}
              {currentMovie.adult && (
                <span className="px-2 py-0.5 bg-destructive/80 rounded text-xs font-semibold">18+</span>
              )}
            </div>

            {/* Overview */}
            <p className="text-sm md:text-base text-foreground/80 mb-6 line-clamp-3 leading-relaxed max-w-lg">
              {currentMovie.overview}
            </p>

            {/* Actions - HBO Max Style */}
            <div className="flex flex-wrap gap-3">
              <Link to={`/movie/${currentMovie.id}`}>
                <Button 
                  size="lg" 
                  className="h-12 px-8 rounded-md bg-foreground text-background hover:bg-foreground/90 font-semibold text-sm uppercase tracking-wider gap-2"
                >
                  <Play className="h-5 w-5 fill-current" />
                  Play
                </Button>
              </Link>
              <Link to={`/movie/${currentMovie.id}`}>
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="h-12 px-8 rounded-md bg-secondary/80 hover:bg-secondary font-semibold text-sm uppercase tracking-wider gap-2"
                >
                  <Info className="h-5 w-5" />
                  More Info
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators - HBO Max Style */}
      <div className="absolute bottom-8 md:bottom-12 left-4 md:left-8 lg:left-12 flex items-center gap-2">
        {featuredMovies.map((movie, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "relative h-1 rounded-full transition-all duration-500 overflow-hidden",
              index === currentIndex ? "w-10 bg-foreground" : "w-6 bg-foreground/30 hover:bg-foreground/50"
            )}
            aria-label={`Go to ${movie.title}`}
          >
            {index === currentIndex && (
              <span 
                className="absolute inset-0 bg-primary origin-left animate-progress"
                style={{ animationDuration: isPaused ? '999999s' : '8s' }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Movie Preview Thumbnails - Desktop Only */}
      <div className="absolute bottom-8 md:bottom-12 right-4 md:right-8 lg:right-12 hidden lg:flex gap-2">
        {featuredMovies.map((movie, index) => (
          <button
            key={movie.id}
            onClick={() => goToSlide(index)}
            className={cn(
              "relative w-24 h-14 rounded overflow-hidden transition-all duration-300",
              index === currentIndex
                ? "ring-2 ring-foreground scale-105"
                : "opacity-50 hover:opacity-80"
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
    </section>
  );
};
