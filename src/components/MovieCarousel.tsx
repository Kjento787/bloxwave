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
      {/* Row Header - HBO Max Style */}
      <div className="flex items-center justify-between mb-2 md:mb-3 px-4 md:px-8 lg:px-12">
        <h2 className="text-lg md:text-xl lg:text-2xl font-bold tracking-tight flex items-center gap-2 group-hover/carousel:text-primary transition-colors">
          {icon}
          <span>{title}</span>
          <ChevronRight className="h-5 w-5 opacity-0 -translate-x-2 group-hover/carousel:opacity-100 group-hover/carousel:translate-x-0 transition-all text-primary" />
        </h2>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Edge Gradient Fades */}
        <div 
          className={cn(
            "absolute left-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none transition-opacity duration-300",
            canScrollLeft ? "opacity-100" : "opacity-0"
          )} 
        />
        <div 
          className={cn(
            "absolute right-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none transition-opacity duration-300",
            canScrollRight ? "opacity-100" : "opacity-0"
          )} 
        />

        {/* Navigation Arrows - HBO Max Full Height Style */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute left-0 top-0 bottom-0 z-20 w-10 md:w-14 h-full rounded-none",
            "bg-background/0 hover:bg-background/60",
            "opacity-0 group-hover/carousel:opacity-100 transition-all duration-300",
            !canScrollLeft && "pointer-events-none !opacity-0"
          )}
          onClick={() => scroll("left")}
        >
          <ChevronLeft className="h-6 w-6 md:h-8 md:w-8" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute right-0 top-0 bottom-0 z-20 w-10 md:w-14 h-full rounded-none",
            "bg-background/0 hover:bg-background/60",
            "opacity-0 group-hover/carousel:opacity-100 transition-all duration-300",
            !canScrollRight && "pointer-events-none !opacity-0"
          )}
          onClick={() => scroll("right")}
        >
          <ChevronRight className="h-6 w-6 md:h-8 md:w-8" />
        </Button>

        {/* Scrollable Content */}
        <div
          ref={scrollRef}
          className="flex gap-2 md:gap-3 overflow-x-auto hide-scrollbar scroll-smooth px-4 md:px-8 lg:px-12 py-2"
        >
          {movies.map((movie, index) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              variant={variant === "large" ? "large" : "default"}
              showProgress={showProgress}
              progress={progressData?.[movie.id]}
              style={{ animationDelay: `${index * 50}ms` }}
              className="animate-fade-in"
            />
          ))}
        </div>
      </div>
    </section>
  );
};
