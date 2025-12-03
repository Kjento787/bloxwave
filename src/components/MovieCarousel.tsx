import { useRef } from "react";
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
}

export const MovieCarousel = ({
  title,
  movies,
  className,
  showProgress,
  progressData,
}: MovieCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

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
      <div className="flex items-center justify-between mb-4 px-4 md:px-0">
        <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover/carousel:opacity-100 transition-opacity"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover/carousel:opacity-100 transition-opacity"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto hide-scrollbar scroll-smooth px-4 md:px-0"
      >
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            className="flex-shrink-0 w-36 md:w-44 animate-fade-in"
            showProgress={showProgress}
            progress={progressData?.[movie.id]}
          />
        ))}
      </div>
    </section>
  );
};
