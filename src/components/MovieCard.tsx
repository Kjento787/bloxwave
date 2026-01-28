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
  const [isHovered, setIsHovered] = useState(false);
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
    default: "w-32 sm:w-36 md:w-40 lg:w-44",
    large: "w-40 sm:w-48 md:w-56 lg:w-64",
    compact: "w-28 sm:w-32 md:w-36",
  };

  return (
    <Link
      to={detailPath}
      className={cn(
        "group relative block rounded-lg overflow-hidden bg-card flex-shrink-0 transition-all duration-300",
        "hover:scale-105 hover:z-20",
        "focus-visible:scale-105 focus-visible:z-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        sizeClasses[variant],
        className
      )}
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Poster Image */}
      <div className="aspect-[2/3] relative overflow-hidden rounded-lg">
        {/* Loading skeleton */}
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
            <Film className="h-8 w-8 text-muted-foreground" />
          </div>
        )}

        {/* Hover Overlay - HBO Max Style */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent rounded-lg",
            "opacity-0 group-hover:opacity-100 transition-all duration-300"
          )}
        />

        {/* Media Type Badge */}
        {movie.media_type && (
          <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded bg-background/80 backdrop-blur-sm">
            {isTV ? <Tv className="h-3 w-3" /> : <Film className="h-3 w-3" />}
            <span className="text-xs font-semibold">{isTV ? "TV" : "Movie"}</span>
          </div>
        )}

        {/* Rating Badge */}
        {movie.vote_average > 0 && (
          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded bg-background/80 backdrop-blur-sm">
            <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-semibold">{movie.vote_average.toFixed(1)}</span>
          </div>
        )}

        {/* Progress Bar */}
        {showProgress && progress !== undefined && progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted/80 rounded-b-lg">
            <div
              className="h-full bg-primary transition-all duration-300 rounded-r-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Hover Actions - HBO Max Style */}
        <div
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-end p-3 gap-2 rounded-lg",
            "opacity-0 group-hover:opacity-100 transition-all duration-300",
            "translate-y-2 group-hover:translate-y-0"
          )}
        >
          <Button 
            size="sm" 
            className="w-full h-9 rounded bg-foreground text-background hover:bg-foreground/90 font-semibold text-xs uppercase tracking-wider"
          >
            <Play className="h-4 w-4 fill-current" />
            Play
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="w-full h-9 rounded bg-secondary/90 hover:bg-secondary font-semibold text-xs"
            onClick={toggleWatchList}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : inList ? (
              <>
                <Check className="h-4 w-4 text-primary" />
                In My List
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Add to List
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Info - Visible on Hover for Desktop, Always on Mobile */}
      <div className="p-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
        <h3 className="font-semibold text-sm line-clamp-1">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground">{year}</p>
      </div>
    </Link>
  );
};
