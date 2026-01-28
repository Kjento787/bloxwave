import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Movie } from "@/lib/tmdb";
import { MovieCard } from "./MovieCard";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface MovieCarouselProps {
  title: string;
  movies: Movie[];
  className?: string;
  showProgress?: boolean;
  progressData?: Record<number, number>;
  icon?: React.ReactNode;
  variant?: "default" | "large";
}

export const MovieCarousel = ({
  title,
  movies,
  className,
  showProgress,
  progressData,
  icon,
  variant = "default",
}: MovieCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const checkScrollability = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollability();
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScrollability);
      window.addEventListener('resize', checkScrollability);
      return () => {
        scrollContainer.removeEventListener('scroll', checkScrollability);
        window.removeEventListener('resize', checkScrollability);
      };
    }
  }, [movies]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!movies.length) return null;

  return (
    <section 
      className={cn("relative group/carousel", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header - HBO Max Style */}
      <div className="flex items-center justify-between mb-3 md:mb-4 px-4 md:px-8 lg:px-12">
        <h2 className="text-lg md:text-xl lg:text-2xl font-bold tracking-tight flex items-center gap-2">
          {icon}
          {title}
        </h2>
        
        {/* Navigation Arrows - Desktop */}
        <div className="hidden md:flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 rounded-full transition-all duration-200",
              canScrollLeft && isHovered
                ? "opacity-100 hover:bg-secondary" 
                : "opacity-0 pointer-events-none"
            )}
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 rounded-full transition-all duration-200",
              canScrollRight && isHovered
                ? "opacity-100 hover:bg-secondary" 
                : "opacity-0 pointer-events-none"
            )}
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Gradient Fades - HBO Max Style */}
        <div 
          className={cn(
            "absolute left-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none transition-opacity duration-300",
            canScrollLeft ? "opacity-100" : "opacity-0"
          )} 
        />
        <div 
          className={cn(
            "absolute right-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none transition-opacity duration-300",
            canScrollRight ? "opacity-100" : "opacity-0"
          )} 
        />

        {/* Large Navigation Arrows - HBO Max Style */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute left-0 top-1/2 -translate-y-1/2 z-20 h-full w-12 rounded-none bg-background/50 hover:bg-background/80 hidden md:flex",
            "opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300",
            !canScrollLeft && "pointer-events-none opacity-0"
          )}
          onClick={() => scroll("left")}
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute right-0 top-1/2 -translate-y-1/2 z-20 h-full w-12 rounded-none bg-background/50 hover:bg-background/80 hidden md:flex",
            "opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300",
            !canScrollRight && "pointer-events-none opacity-0"
          )}
          onClick={() => scroll("right")}
        >
          <ChevronRight className="h-8 w-8" />
        </Button>

        {/* Scrollable Content */}
        <div
          ref={scrollRef}
          className="flex gap-2 md:gap-3 overflow-x-auto hide-scrollbar scroll-smooth px-4 md:px-8 lg:px-12 pb-4"
        >
          {movies.map((movie, index) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              variant={variant === "large" ? "large" : "default"}
              showProgress={showProgress}
              progress={progressData?.[movie.id]}
              style={{ animationDelay: `${index * 30}ms` }}
              className="animate-fade-in"
            />
          ))}
        </div>
      </div>
    </section>
  );
};
