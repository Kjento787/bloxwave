import { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Clock, AlertTriangle } from "lucide-react";
import { Movie, getImageUrl } from "@/lib/tmdb";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface LeavingSoonRowProps {
  title?: string;
  movies: Movie[];
  className?: string;
}

// Mock expiration times - in production this would come from your database
const getExpirationTime = (index: number): Date => {
  const now = new Date();
  const hoursOptions = [6, 12, 24, 48, 72, 120, 168, 240, 336];
  const hoursLeft = hoursOptions[index % hoursOptions.length];
  return new Date(now.getTime() + hoursLeft * 60 * 60 * 1000);
};

interface CountdownProps {
  targetDate: Date;
}

const LiveCountdown = ({ targetDate }: CountdownProps) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isUrgent, setIsUrgent] = useState(false);

  const calculateTimeLeft = useCallback(() => {
    const now = new Date().getTime();
    const target = targetDate.getTime();
    const difference = target - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
    };
  }, [targetDate]);

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      setIsUrgent(newTimeLeft.days === 0 && newTimeLeft.hours < 24);
    }, 1000);

    const initial = calculateTimeLeft();
    setTimeLeft(initial);
    setIsUrgent(initial.days === 0 && initial.hours < 24);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  const formatNumber = (num: number) => String(num).padStart(2, '0');

  if (timeLeft.days > 0) {
    return (
      <div className={cn(
        "flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider",
        timeLeft.days <= 3 
          ? "bg-destructive text-destructive-foreground" 
          : "bg-accent text-accent-foreground"
      )}>
        <Clock className="h-3 w-3" />
        <span>{timeLeft.days}d {timeLeft.hours}h</span>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex items-center gap-1 px-2 py-1 rounded font-mono text-[11px] font-bold",
      isUrgent ? "bg-destructive text-destructive-foreground animate-pulse" : "bg-accent text-accent-foreground"
    )}>
      {isUrgent && <AlertTriangle className="h-3 w-3" />}
      <span>{formatNumber(timeLeft.hours)}:{formatNumber(timeLeft.minutes)}:{formatNumber(timeLeft.seconds)}</span>
    </div>
  );
};

export const LeavingSoonRow = ({ title = "Leaving Soon", movies, className }: LeavingSoonRowProps) => {
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
    <section className={cn("relative group/leaving", className)}>
      <div className="flex items-center gap-2 mb-3 px-4 md:px-8 lg:px-12">
        <Clock className="h-5 w-5 text-destructive" />
        <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
        <span className="text-xs text-muted-foreground ml-2">Live countdowns</span>
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
            "opacity-0 group-hover/leaving:opacity-100 transition-opacity",
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
            "opacity-0 group-hover/leaving:opacity-100 transition-opacity",
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
          {movies.slice(0, 10).map((movie, index) => {
            const isTV = movie.media_type === "tv";
            const detailPath = isTV ? `/tv/${movie.id}` : `/movie/${movie.id}`;
            const movieTitle = movie.title || movie.name;
            const expirationDate = getExpirationTime(index);
            const daysLeft = Math.ceil((expirationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

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
                    alt={movieTitle}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  
                  {/* Live Countdown Badge */}
                  <div className="absolute top-2 left-2">
                    <LiveCountdown targetDate={expirationDate} />
                  </div>

                  {/* Urgent Border for items leaving very soon */}
                  {daysLeft <= 1 && (
                    <div className="absolute inset-0 rounded-lg border-2 border-destructive pointer-events-none animate-pulse" />
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />
                </div>
                
                <div className="mt-2">
                  <h3 className="font-medium text-sm line-clamp-1">{movieTitle}</h3>
                  <p className="text-xs text-destructive font-medium">
                    {daysLeft <= 0 ? "Leaving today!" : daysLeft === 1 ? "Last day!" : `${daysLeft} days left`}
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
