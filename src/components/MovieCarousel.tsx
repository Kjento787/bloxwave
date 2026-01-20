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
}

export const MovieCarousel = ({
  title,
  movies,
  className,
  showProgress,
  progressData,
  icon,
}: MovieCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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
      const scrollAmount = scrollRef.current.clientWidth * 0.75;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!movies.length) return null;

  return (
    <section className={cn("relative group/carousel", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5 px-4 md:px-0">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight flex items-center gap-2">
          {icon}
          {title}
        </h2>
        <div className="flex gap-1.5">
          <Button
            variant="secondary"
            size="icon"
            className={cn(
              "h-9 w-9 rounded-full transition-all duration-200",
              canScrollLeft 
                ? "opacity-100 hover:scale-105" 
                : "opacity-30 cursor-not-allowed"
            )}
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className={cn(
              "h-9 w-9 rounded-full transition-all duration-200",
              canScrollRight 
                ? "opacity-100 hover:scale-105" 
                : "opacity-30 cursor-not-allowed"
            )}
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Gradient Fades */}
        <div 
          className={cn(
            "absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none transition-opacity duration-300",
            canScrollLeft ? "opacity-100" : "opacity-0"
          )} 
        />
        <div 
          className={cn(
            "absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none transition-opacity duration-300",
            canScrollRight ? "opacity-100" : "opacity-0"
          )} 
        />

        {/* Scrollable Content */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto hide-scrollbar scroll-smooth px-4 md:px-0 pb-2"
        >
          {movies.map((movie, index) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              className="flex-shrink-0 w-36 md:w-44"
              showProgress={showProgress}
              progress={progressData?.[movie.id]}
              style={{ animationDelay: `${index * 50}ms` }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
