import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Play, Info, Star, Volume2, VolumeX } from "lucide-react";
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
  const [isMuted, setIsMuted] = useState(true);
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
      className="relative w-full h-[100vh] md:h-screen overflow-hidden"
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
              : "opacity-0 scale-105 pointer-events-none"
          )}
        >
          <img
            src={getImageUrl(movie.backdrop_path, "original")}
            alt={movie.title}
            className="w-full h-full object-cover object-center"
          />
        </div>
      ))}

      {/* HBO Max Style Multi-Layer Gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
      <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-background via-background/80 to-transparent" />
      
      {/* Vignette Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background)/0.3)_100%)]" />

      {/* Content Container */}
      <div className="absolute inset-0 flex items-end pb-32 md:pb-48 lg:pb-56">
        <div className="w-full px-4 md:px-8 lg:px-12 max-w-4xl">
          <div 
            key={currentMovie.id}
            className="animate-slide-up"
          >
            {/* Title - HBO Max Style Large Typography */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-3 md:mb-4 leading-[0.95] tracking-tight text-shadow-lg">
              {currentMovie.title}
            </h1>

            {/* Meta Info Row */}
            <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-3 md:mb-4 text-sm md:text-base">
              <div className="flex items-center gap-1.5 text-yellow-400">
                <Star className="h-4 w-4 md:h-5 md:w-5 fill-current" />
                <span className="font-bold">{currentMovie.vote_average.toFixed(1)}</span>
              </div>
              
              {currentMovie.release_date && (
                <span className="text-foreground/60 font-medium">
                  {currentMovie.release_date.split("-")[0]}
                </span>
              )}
              
              <span className="px-2 py-0.5 rounded bg-foreground/10 text-xs md:text-sm font-semibold">
                HD
              </span>
              
              {currentMovie.adult && (
                <span className="px-2 py-0.5 bg-destructive/90 rounded text-xs font-bold">
                  18+
                </span>
              )}
            </div>

            {/* Overview - Truncated */}
            <p className="text-sm md:text-base lg:text-lg text-foreground/70 mb-5 md:mb-6 line-clamp-2 md:line-clamp-3 leading-relaxed max-w-2xl">
              {currentMovie.overview}
            </p>

            {/* Action Buttons - HBO Max Style */}
            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              <Link to={`/movie/${currentMovie.id}`}>
                <Button 
                  size="lg" 
                  className="h-11 md:h-12 px-6 md:px-8 rounded-md bg-foreground text-background hover:bg-foreground/90 font-bold text-sm md:text-base uppercase tracking-wider gap-2 shadow-lg"
                >
                  <Play className="h-4 w-4 md:h-5 md:w-5 fill-current" />
                  Play
                </Button>
              </Link>
              <Link to={`/movie/${currentMovie.id}`}>
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="h-11 md:h-12 px-6 md:px-8 rounded-md bg-secondary/70 hover:bg-secondary backdrop-blur-sm font-bold text-sm md:text-base uppercase tracking-wider gap-2"
                >
                  <Info className="h-4 w-4 md:h-5 md:w-5" />
                  More Info
                </Button>
              </Link>
              
              {/* Mute Button - HBO Style */}
              <Button
                size="icon"
                variant="ghost"
                className="h-10 w-10 md:h-11 md:w-11 rounded-full border border-foreground/30 hover:bg-foreground/10"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4 md:h-5 md:w-5" />
                ) : (
                  <Volume2 className="h-4 w-4 md:h-5 md:w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Indicators - Bottom Left - HBO Max Style */}
      <div className="absolute bottom-8 md:bottom-12 left-4 md:left-8 lg:left-12 flex items-center gap-1.5 md:gap-2 z-20">
        {featuredMovies.map((movie, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "relative h-1 md:h-1.5 rounded-full transition-all duration-500 overflow-hidden",
              index === currentIndex 
                ? "w-10 md:w-12 bg-foreground" 
                : "w-5 md:w-6 bg-foreground/30 hover:bg-foreground/50"
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

      {/* Thumbnail Preview Strip - Desktop Only - HBO Max Style */}
      <div className="absolute bottom-8 md:bottom-12 right-4 md:right-8 lg:right-12 hidden lg:flex gap-2 z-20">
        {featuredMovies.map((movie, index) => (
          <button
            key={movie.id}
            onClick={() => goToSlide(index)}
            className={cn(
              "relative w-20 xl:w-24 h-12 xl:h-14 rounded-md overflow-hidden transition-all duration-300",
              index === currentIndex
                ? "ring-2 ring-foreground ring-offset-2 ring-offset-background scale-105"
                : "opacity-40 hover:opacity-70 grayscale hover:grayscale-0"
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
