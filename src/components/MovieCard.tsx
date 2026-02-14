import { useState } from "react";
import { Link } from "react-router-dom";
import { Play, Plus, Check, Star, Tv, Film, Loader2 } from "lucide-react";
import { Movie, getImageUrl } from "@/lib/tmdb";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useWatchlist } from "@/hooks/useWatchlist";

interface MovieCardProps {
  movie: Movie;
  className?: string;
  showProgress?: boolean;
  progress?: number;
  style?: React.CSSProperties;
  variant?: "default" | "large" | "compact";
}

export const MovieCard = ({ 
  movie, 
  className, 
  showProgress, 
  progress, 
  style,
  variant = "default" 
}: MovieCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
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
    <Link
      to={detailPath}
      className={cn(
        "group relative block rounded-lg overflow-hidden bg-card flex-shrink-0",
        "transition-all duration-300 ease-out",
        "hover:scale-[1.08] hover:z-20 hover:shadow-hover",
        "focus-visible:scale-[1.08] focus-visible:z-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        sizeClasses[variant],
        className
      )}
      style={style}
    >
      {/* Poster Image Container */}
      <div className="aspect-[2/3] relative overflow-hidden rounded-lg">
        {/* Loading Skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-secondary animate-shimmer rounded-lg" />
        )}
        
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className={cn(
              "w-full h-full object-cover transition-all duration-500 rounded-lg",
              "group-hover:scale-110",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
          />
        ) : (
          <div className="w-full h-full bg-secondary flex items-center justify-center rounded-lg">
            <Film className="h-10 w-10 text-muted-foreground" />
          </div>
        )}

        {/* Hover Gradient Overlay */}
        <div
          className={cn(
            "absolute inset-0 rounded-lg",
            "bg-gradient-to-t from-background via-background/60 to-transparent",
            "opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          )}
        />

        {/* Media Type Badge - Top Left */}
        {movie.media_type && (
          <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-md bg-background/80 backdrop-blur-sm text-xs font-semibold">
            {isTV ? <Tv className="h-3 w-3" /> : <Film className="h-3 w-3" />}
            <span>{isTV ? "TV" : "Movie"}</span>
          </div>
        )}

        {/* Rating Badge - Top Right */}
        {movie.vote_average > 0 && (
          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-md bg-background/80 backdrop-blur-sm text-xs font-semibold">
            <Star className="h-3 w-3 text-primary fill-primary" />
            <span>{movie.vote_average.toFixed(1)}</span>
          </div>
        )}

        {/* Progress Bar - Bottom */}
        {showProgress && progress !== undefined && progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted/60 rounded-b-lg overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Hover Actions - HBO Max Style */}
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 p-3 flex flex-col gap-2",
            "opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0",
            "transition-all duration-300"
          )}
        >
          <Button 
            size="sm" 
            className="w-full h-9 rounded-md bg-foreground text-background hover:bg-foreground/90 font-bold text-xs uppercase tracking-wider gap-1.5"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            Play
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="w-full h-9 rounded-md bg-secondary/80 backdrop-blur-sm hover:bg-secondary font-semibold text-xs gap-1.5"
            onClick={toggleWatchList}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : inList ? (
              <>
                <Check className="h-3.5 w-3.5 text-primary" />
                In List
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" />
                My List
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Card Info - Visible Always on Mobile, Hover on Desktop */}
      <div className="p-2 md:p-0 md:absolute md:inset-x-0 md:bottom-0 md:p-3 md:opacity-0 md:group-hover:opacity-0">
        <h3 className="font-semibold text-sm line-clamp-1 md:hidden">{title}</h3>
        <p className="text-xs text-muted-foreground md:hidden">{year}</p>
      </div>
    </Link>
  );
};
