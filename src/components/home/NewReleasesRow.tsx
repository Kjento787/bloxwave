import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Movie, getImageUrl } from "@/lib/tmdb";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface NewReleasesRowProps {
  title?: string;
  movies: Movie[];
  className?: string;
}

export const NewReleasesRow = ({ title = "Just Added", movies, className }: NewReleasesRowProps) => {
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
      const amount = scrollRef.current.clientWidth * 0.75;
      scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
    }
  };

  if (!movies.length) return null;

  return (
    <section className={cn("relative group/new", className)}>
      <div className="flex items-center gap-2 mb-3 px-4 md:px-8 lg:px-12">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
      </div>

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
            "opacity-0 group-hover/new:opacity-100 transition-opacity",
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
            "opacity-0 group-hover/new:opacity-100 transition-opacity",
            !canScrollRight && "pointer-events-none !opacity-0"
          )}
          onClick={() => scroll("right")}
        >
          <ChevronRight className="h-8 w-8" />
        </Button>

        {/* Scrollable Content */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto hide-scrollbar scroll-smooth px-4 md:px-8 lg:px-12 py-2"
        >
          {movies.map((movie, index) => {
            const isTV = movie.media_type === "tv";
            const detailPath = isTV ? `/tv/${movie.id}` : `/movie/${movie.id}`;
            const title = movie.title || movie.name;

            return (
              <Link
                key={movie.id}
                to={detailPath}
                className="group/card relative flex-shrink-0 w-[140px] md:w-[160px] lg:w-[180px]"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden transition-all duration-300 group-hover/card:scale-105 group-hover/card:shadow-hover">
                  <img
                    src={getImageUrl(movie.poster_path, "w500")}
                    alt={title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  
                  {/* NEW Badge */}
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider">
                    NEW
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />
                </div>
                
                <div className="mt-2">
                  <h3 className="font-medium text-sm line-clamp-1">{title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {(movie.release_date || movie.first_air_date)?.split("-")[0]}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};