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
}

export const MovieCard = ({ movie, className, showProgress, progress, style }: MovieCardProps) => {
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

  return (
    <Link
      to={detailPath}
      className={cn(
        "group relative block rounded-xl overflow-hidden bg-card transition-all duration-300",
        "hover:scale-[1.03] hover:shadow-glow hover:z-10",
        "focus-visible:scale-[1.03] focus-visible:shadow-glow focus-visible:z-10",
        "active:scale-[1.01]",
        "animate-fade-in",
        className
      )}
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Poster Image */}
      <div className="aspect-[2/3] relative overflow-hidden">
        {/* Loading skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-muted animate-shimmer" />
        )}
        
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className={cn(
              "w-full h-full object-cover transition-all duration-500",
              "group-hover:scale-110",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground text-sm">No Image</span>
          </div>
        )}

        {/* Gradient Overlay */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent",
            "opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          )}
        />

        {/* Media Type Badge */}
        {movie.media_type && (
          <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-md bg-primary/90 backdrop-blur-sm shadow-lg">
            {isTV ? <Tv className="h-3 w-3" /> : <Film className="h-3 w-3" />}
            <span className="text-xs font-semibold text-primary-foreground">{isTV ? "TV" : "Movie"}</span>
          </div>
        )}

        {/* Rating Badge */}
        {movie.vote_average > 0 && (
          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-md bg-background/80 backdrop-blur-sm shadow-lg">
            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
            <span className="text-xs font-semibold">{movie.vote_average.toFixed(1)}</span>
          </div>
        )}

        {/* Progress Bar */}
        {showProgress && progress !== undefined && progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-muted/80">
            <div
              className="h-full bg-primary transition-all duration-300 rounded-r-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Hover Actions */}
        <div
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-end p-3 gap-2",
            "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-all duration-300",
            "translate-y-4 group-hover:translate-y-0 group-focus-visible:translate-y-0"
          )}
        >
          <Button 
            size="sm" 
            variant="hero" 
            className="w-full shadow-lg hover:scale-105 transition-transform"
          >
            <Play className="h-4 w-4 fill-current" />
            Watch Now
          </Button>
          <Button
            size="sm"
            variant="glass"
            className="w-full hover:scale-105 transition-transform"
            onClick={toggleWatchList}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : inList ? (
              <>
                <Check className="h-4 w-4 text-primary" />
                In List
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

      {/* Info */}
      <div className="p-3 space-y-1">
        <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors duration-200">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground">{year}</p>
      </div>
    </Link>
  );
};
