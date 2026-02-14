import { useState } from "react";
import { Link } from "react-router-dom";
import { Play, Plus, Check, Star, Tv, Film, Loader2 } from "lucide-react";
import { Movie, getImageUrl } from "@/lib/tmdb";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useWatchlist } from "@/hooks/useWatchlist";
import { motion } from "framer-motion";

interface MovieCardProps {
  movie: Movie;
  className?: string;
  showProgress?: boolean;
  progress?: number;
  style?: React.CSSProperties;
  variant?: "default" | "large" | "compact";
  index?: number;
}

export const MovieCard = ({ 
  movie, 
  className, 
  showProgress, 
  progress, 
  style,
  variant = "default",
  index = 0,
}: MovieCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  
  const imageUrl = getImageUrl(movie.poster_path, "w500");
  const title = movie.title || movie.name || "Unknown";
  const year = (movie.release_date || movie.first_air_date)?.split("-")[0] || "";
  const isTV = movie.media_type === "tv";
  const contentType = isTV ? "tv" : "movie";
  const detailPath = isTV ? `/tv/${movie.id}` : `/movie/${movie.id}`;
  const inList = isInWatchlist(movie.id, contentType);
  const isPending = addToWatchlist.isPending || removeFromWatchlist.isPending;

  const toggleWatchList = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inList) {
      removeFromWatchlist.mutate({ contentId: movie.id, contentType });
    } else {
      addToWatchlist.mutate({ contentId: movie.id, contentType });
    }
  };

  const sizeClasses = {
    default: "w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px]",
    large: "w-[180px] sm:w-[200px] md:w-[240px] lg:w-[280px]",
    compact: "w-[120px] sm:w-[140px] md:w-[160px]",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.05,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn("flex-shrink-0", sizeClasses[variant])}
      style={style}
    >
      <Link
        to={detailPath}
        className={cn(
          "group relative block rounded-xl overflow-hidden bg-card",
          "transition-all duration-500 ease-out",
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Poster Image Container */}
        <div className={cn(
          "aspect-[2/3] relative overflow-hidden rounded-xl transition-all duration-500",
          isHovered && "shadow-[0_20px_60px_-15px_hsl(var(--primary)/0.3)]"
        )}>
          {/* Loading Skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-secondary animate-shimmer rounded-xl" />
          )}
          
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className={cn(
                "w-full h-full object-cover transition-all duration-700 rounded-xl",
                isHovered ? "scale-110 brightness-75" : "scale-100",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
            />
          ) : (
            <div className="w-full h-full bg-secondary flex items-center justify-center rounded-xl">
              <Film className="h-10 w-10 text-muted-foreground" />
            </div>
          )}

          {/* Hover Gradient */}
          <div className={cn(
            "absolute inset-0 rounded-xl transition-opacity duration-500",
            "bg-gradient-to-t from-background via-background/40 to-transparent",
            isHovered ? "opacity-100" : "opacity-0"
          )} />

          {/* Glow ring on hover */}
          <div className={cn(
            "absolute inset-0 rounded-xl transition-all duration-500 pointer-events-none",
            isHovered 
              ? "ring-1 ring-primary/40 ring-inset" 
              : "ring-0 ring-transparent"
          )} />

          {/* Media Type Badge */}
          {movie.media_type && (
            <div className={cn(
              "absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-1 rounded-full bg-background/70 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider transition-all duration-300",
              isHovered ? "opacity-0 -translate-y-2" : "opacity-100"
            )}>
              {isTV ? <Tv className="h-3 w-3" /> : <Film className="h-3 w-3" />}
              <span>{isTV ? "TV" : "Film"}</span>
            </div>
          )}

          {/* Rating Badge */}
          {movie.vote_average > 0 && (
            <div className={cn(
              "absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-1 rounded-full bg-background/70 backdrop-blur-md text-[10px] font-bold transition-all duration-300",
              isHovered ? "opacity-0 -translate-y-2" : "opacity-100"
            )}>
              <Star className="h-3 w-3 text-primary fill-primary" />
              {movie.vote_average.toFixed(1)}
            </div>
          )}

          {/* Progress Bar */}
          {showProgress && progress !== undefined && progress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted/60 rounded-b-xl overflow-hidden z-10">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {/* Hover Actions */}
          <div className={cn(
            "absolute inset-x-0 bottom-0 p-3 flex flex-col gap-2 transition-all duration-400",
            isHovered 
              ? "opacity-100 translate-y-0" 
              : "opacity-0 translate-y-6 pointer-events-none"
          )}>
            {/* Title on hover */}
            <h3 className="font-bold text-sm line-clamp-1 text-foreground mb-1 font-display">
              {title}
            </h3>
            <div className="flex items-center gap-2 text-[10px] text-foreground/60 mb-1">
              {movie.vote_average > 0 && (
                <span className="text-primary font-bold flex items-center gap-0.5">
                  <Star className="h-2.5 w-2.5 fill-current" />
                  {movie.vote_average.toFixed(1)}
                </span>
              )}
              {year && <span>{year}</span>}
              <span className="px-1.5 py-0.5 border border-foreground/20 rounded text-[9px] font-bold">HD</span>
            </div>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                className="flex-1 h-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-[10px] uppercase tracking-wider gap-1"
              >
                <Play className="h-3 w-3 fill-current" />
                Play
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 rounded-full bg-foreground/10 backdrop-blur-sm border border-foreground/10"
                onClick={toggleWatchList}
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : inList ? (
                  <Check className="h-3.5 w-3.5 text-primary" />
                ) : (
                  <Plus className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Title below card — mobile only */}
        <div className={cn(
          "mt-2 px-0.5 transition-opacity duration-300",
          isHovered ? "opacity-0" : "opacity-100"
        )}>
          <h3 className="font-semibold text-xs line-clamp-1 md:text-sm">{title}</h3>
          <p className="text-[10px] text-muted-foreground md:text-xs">{year}</p>
        </div>
      </Link>
    </motion.div>
  );
};
