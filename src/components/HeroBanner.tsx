import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { Play, Info, Star, Volume2, VolumeX, ChevronRight } from "lucide-react";
import { Movie, getImageUrl } from "@/lib/tmdb";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface HeroBannerProps {
  movies: Movie[];
}

export const HeroBanner = ({ movies }: HeroBannerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const featuredMovies = movies.slice(0, 6);
  const currentMovie = featuredMovies[currentIndex];

  // Parallax scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        setScrollY(window.scrollY);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const goToNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
    setTimeout(() => setIsTransitioning(false), 1000);
  }, [featuredMovies.length, isTransitioning]);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 1000);
  }, [isTransitioning, currentIndex]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(goToNext, 8000);
    return () => clearInterval(timer);
  }, [goToNext, isPaused]);

  if (!currentMovie) return null;

  const parallaxOffset = scrollY * 0.4;
  const contentOpacity = Math.max(0, 1 - scrollY / 600);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[105vh] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Parallax Background Images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMovie.id}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-0"
          style={{ transform: `translateY(${parallaxOffset}px) scale(${1 + scrollY * 0.0003})` }}
        >
          <img
            src={getImageUrl(currentMovie.backdrop_path, "original")}
            alt={currentMovie.title}
            className="w-full h-full object-cover object-top"
          />
        </motion.div>
      </AnimatePresence>

      {/* Cinematic Letterbox Bars */}
      <div className="absolute top-0 left-0 right-0 h-[8vh] bg-background/80 backdrop-blur-sm z-10" 
           style={{ opacity: Math.min(1, scrollY / 200) }} />

      {/* Multi-Layer Gradients — Cinematic */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
      <div className="absolute bottom-0 left-0 right-0 h-[50%] bg-gradient-to-t from-background via-background/90 to-transparent" />
      
      {/* Film Grain Overlay */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background)/0.5)_100%)]" />

      {/* Floating Bokeh Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-primary/10 blur-xl animate-float"
            style={{
              width: `${60 + i * 30}px`,
              height: `${60 + i * 30}px`,
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 1.5}s`,
              animationDuration: `${8 + i * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Content Container — Parallax offset */}
      <div
        className="absolute inset-0 flex items-end pb-36 md:pb-48 lg:pb-56"
        style={{ opacity: contentOpacity, transform: `translateY(${-scrollY * 0.15}px)` }}
      >
        <div className="w-full px-4 md:px-8 lg:px-12 max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMovie.id}
              initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(4px)" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Category Tag */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 mb-4"
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Trending Now
                </span>
              </motion.div>

              {/* Title — Large Cinematic Typography */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-4 leading-[0.9] tracking-[-0.02em] text-shadow-lg font-display">
                {currentMovie.title}
              </h1>

              {/* Meta Info Row */}
              <div className="flex flex-wrap items-center gap-3 mb-4 text-sm md:text-base">
                <div className="flex items-center gap-1.5 text-primary">
                  <Star className="h-4 w-4 md:h-5 md:w-5 fill-current" />
                  <span className="font-bold">{currentMovie.vote_average.toFixed(1)}</span>
                </div>
                {currentMovie.release_date && (
                  <span className="text-foreground/50 font-medium">
                    {currentMovie.release_date.split("-")[0]}
                  </span>
                )}
                <span className="px-2.5 py-0.5 rounded-full bg-foreground/10 text-xs font-bold tracking-wider">
                  HD
                </span>
                {currentMovie.adult && (
                  <span className="px-2.5 py-0.5 bg-destructive/90 rounded-full text-xs font-bold">
                    18+
                  </span>
                )}
              </div>

              {/* Overview */}
              <p className="text-sm md:text-base lg:text-lg text-foreground/60 mb-6 line-clamp-2 md:line-clamp-3 leading-relaxed max-w-2xl">
                {currentMovie.overview}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <Link to={`/movie/${currentMovie.id}`}>
                  <Button
                    size="lg"
                    className="h-12 md:h-14 px-8 md:px-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-sm md:text-base uppercase tracking-wider gap-2.5 shadow-glow transition-all duration-300 hover:shadow-[0_0_40px_hsl(var(--primary)/0.4)]"
                  >
                    <Play className="h-5 w-5 fill-current" />
                    Watch Now
                  </Button>
                </Link>
                <Link to={`/movie/${currentMovie.id}`}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 md:h-14 px-8 md:px-10 rounded-full border-foreground/20 bg-foreground/5 hover:bg-foreground/10 backdrop-blur-md font-bold text-sm md:text-base uppercase tracking-wider gap-2.5"
                  >
                    <Info className="h-5 w-5" />
                    Details
                  </Button>
                </Link>

                {/* Mute Button */}
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-12 w-12 rounded-full border border-foreground/20 hover:bg-foreground/10 backdrop-blur-sm"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Slide Indicators — Bottom Left */}
      <div
        className="absolute bottom-10 md:bottom-14 left-4 md:left-8 lg:left-12 flex items-center gap-2 z-20"
        style={{ opacity: contentOpacity }}
      >
        {featuredMovies.map((movie, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "relative h-1 rounded-full transition-all duration-500 overflow-hidden",
              index === currentIndex
                ? "w-12 bg-primary/40"
                : "w-6 bg-foreground/20 hover:bg-foreground/40"
            )}
            aria-label={`Go to ${movie.title}`}
          >
            {index === currentIndex && (
              <motion.span
                className="absolute inset-0 bg-primary rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: isPaused ? 999 : 8, ease: "linear" }}
                style={{ transformOrigin: "left" }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Thumbnail Strip — Desktop */}
      <div
        className="absolute bottom-10 md:bottom-14 right-4 md:right-8 lg:right-12 hidden lg:flex gap-2.5 z-20"
        style={{ opacity: contentOpacity }}
      >
        {featuredMovies.map((movie, index) => (
          <button
            key={movie.id}
            onClick={() => goToSlide(index)}
            className={cn(
              "relative w-20 xl:w-24 h-12 xl:h-14 rounded-lg overflow-hidden transition-all duration-500",
              index === currentIndex
                ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-110"
                : "opacity-30 hover:opacity-60 grayscale hover:grayscale-0 scale-100"
            )}
          >
            <img
              src={getImageUrl(movie.backdrop_path, "w300")}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
            {index === currentIndex && (
              <div className="absolute inset-0 border-2 border-primary/50 rounded-lg" />
            )}
          </button>
        ))}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: scrollY < 50 ? 0.5 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/40">Scroll</span>
        <motion.div
          className="w-4 h-7 rounded-full border border-foreground/30 flex justify-center pt-1.5"
          animate={{ y: [0, 4, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <div className="w-0.5 h-1.5 rounded-full bg-foreground/50" />
        </motion.div>
      </motion.div>
    </section>
  );
};
