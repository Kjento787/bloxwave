import { Link } from "react-router-dom";
import { Movie, getImageUrl } from "@/lib/tmdb";
import { cn } from "@/lib/utils";
import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

interface Top10RowProps {
  title: string;
  movies: Movie[];
  className?: string;
}

export const Top10Row = ({ title, movies, className }: Top10RowProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const top10 = movies.slice(0, 10);

  const checkScrollability = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollability();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScrollability);
      window.addEventListener('resize', checkScrollability);
      return () => {
        el.removeEventListener('scroll', checkScrollability);
        window.removeEventListener('resize', checkScrollability);
      };
    }
  }, [movies]);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      const amount = scrollRef.current.clientWidth * 0.6;
      scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
    }
  };

  if (!top10.length) return null;

  return (
    <section className={cn("relative group/top10", className)}>
      <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 px-4 md:px-8 lg:px-12 flex items-center gap-3">
        <span className="text-gradient font-black">TOP 10</span>
        <span>{title}</span>
      </h2>

      <div className="relative">
        {/* Edge Fades */}
        <div className={cn(
          "absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none transition-opacity",
          canScrollLeft ? "opacity-100" : "opacity-0"
        )} />
        <div className={cn(
          "absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none transition-opacity",
          canScrollRight ? "opacity-100" : "opacity-0"
        )} />

        {/* Navigation */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute left-0 top-0 bottom-0 z-20 w-12 h-full rounded-none bg-transparent hover:bg-background/60",
            "opacity-0 group-hover/top10:opacity-100 transition-opacity",
            !canScrollLeft && "pointer-events-none !opacity-0"
          )}
          onClick={() => scroll("left")}
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute right-0 top-0 bottom-0 z-20 w-12 h-full rounded-none bg-transparent hover:bg-background/60",
            "opacity-0 group-hover/top10:opacity-100 transition-opacity",
            !canScrollRight && "pointer-events-none !opacity-0"
          )}
          onClick={() => scroll("right")}
        >
          <ChevronRight className="h-8 w-8" />
        </Button>

        {/* Scrollable Content */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto hide-scrollbar scroll-smooth px-4 md:px-8 lg:px-12 py-2"
        >
          {top10.map((movie, index) => {
            const isTV = movie.media_type === "tv";
            const detailPath = isTV ? `/tv/${movie.id}` : `/movie/${movie.id}`;
            
            return (
              <Link
                key={movie.id}
                to={detailPath}
                className="group relative flex-shrink-0 flex items-end"
              >
                {/* Large Number */}
                <span 
                  className="absolute -left-2 md:-left-4 bottom-0 text-[120px] md:text-[160px] lg:text-[200px] font-black leading-none select-none z-0"
                  style={{
                    WebkitTextStroke: '2px hsl(var(--primary))',
                    color: 'transparent',
                    textShadow: '0 0 40px hsl(var(--primary) / 0.3)',
                  }}
                >
                  {index + 1}
                </span>
                
                {/* Poster */}
                <div className="relative z-10 ml-8 md:ml-12 lg:ml-16 w-[100px] md:w-[130px] lg:w-[150px] aspect-[2/3] rounded-lg overflow-hidden transition-transform duration-300 group-hover:scale-105 group-hover:shadow-hover">
                  <img
                    src={getImageUrl(movie.poster_path, "w500")}
                    alt={movie.title || movie.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};