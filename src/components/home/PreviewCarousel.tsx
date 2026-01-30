import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Movie } from "@/lib/tmdb";
import { QuickPreviewCard } from "./QuickPreviewCard";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface PreviewCarouselProps {
  title: string;
  movies: Movie[];
  icon?: React.ReactNode;
  className?: string;
}

export const PreviewCarousel = ({ title, movies, icon, className }: PreviewCarouselProps) => {
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
      const amount = scrollRef.current.clientWidth * 0.7;
      scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
    }
  };

  if (!movies.length) return null;

  return (
    <section className={cn("relative group/preview", className)}>
      <div className="flex items-center gap-2 mb-3 px-4 md:px-8 lg:px-12">
        {icon}
        <h2 className="text-xl md:text-2xl font-bold group-hover/preview:text-primary transition-colors">
          {title}
        </h2>
        <ChevronRight className="h-5 w-5 opacity-0 -translate-x-2 group-hover/preview:opacity-100 group-hover/preview:translate-x-0 transition-all text-primary" />
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
            "opacity-0 group-hover/preview:opacity-100 transition-opacity",
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
            "opacity-0 group-hover/preview:opacity-100 transition-opacity",
            !canScrollRight && "pointer-events-none !opacity-0"
          )}
          onClick={() => scroll("right")}
        >
          <ChevronRight className="h-8 w-8" />
        </Button>

        {/* Scrollable Content - Extra padding bottom for expanded preview */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto hide-scrollbar scroll-smooth px-4 md:px-8 lg:px-12 py-2 pb-32"
        >
          {movies.map((movie, index) => (
            <QuickPreviewCard
              key={movie.id}
              movie={movie}
              style={{ animationDelay: `${index * 50}ms` }}
              className="animate-fade-in"
            />
          ))}
        </div>
      </div>
    </section>
  );
};