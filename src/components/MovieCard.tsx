import { useState } from "react";
import { Link } from "react-router-dom";
import { Play, Plus, Check, Star } from "lucide-react";
import { Movie, getImageUrl } from "@/lib/tmdb";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { isInWatchList, addToWatchList, removeFromWatchList } from "@/lib/watchHistory";

interface MovieCardProps {
  movie: Movie;
  className?: string;
  showProgress?: boolean;
  progress?: number;
}

export const MovieCard = ({ movie, className, showProgress, progress }: MovieCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [inList, setInList] = useState(isInWatchList(movie.id));
  const imageUrl = getImageUrl(movie.poster_path, "w500");
  const year = movie.release_date?.split("-")[0] || "";

  const toggleWatchList = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inList) {
      removeFromWatchList(movie.id);
    } else {
      addToWatchList({
        movieId: movie.id,
        title: movie.title,
        posterPath: movie.poster_path,
      });
    }
    setInList(!inList);
  };

  return (
    <Link
      to={`/movie/${movie.id}`}
      className={cn(
        "group relative block rounded-xl overflow-hidden bg-card transition-all duration-300",
        "hover:scale-105 hover:shadow-card hover:z-10",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Poster Image */}
      <div className="aspect-[2/3] relative">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground text-sm">No Image</span>
          </div>
        )}

        {/* Gradient Overlay */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent",
            "opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          )}
        />

        {/* Rating Badge */}
        <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-md bg-background/80 backdrop-blur-sm">
          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
          <span className="text-xs font-semibold">{movie.vote_average.toFixed(1)}</span>
        </div>

        {/* Progress Bar */}
        {showProgress && progress !== undefined && progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Hover Actions */}
        <div
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-end p-4 gap-2",
            "opacity-0 group-hover:opacity-100 transition-all duration-300"
          )}
        >
          <Button size="sm" variant="hero" className="w-full">
            <Play className="h-4 w-4 fill-current" />
            Watch Now
          </Button>
          <Button
            size="sm"
            variant="glass"
            className="w-full"
            onClick={toggleWatchList}
          >
            {inList ? (
              <>
                <Check className="h-4 w-4" />
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
      <div className="p-3">
        <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
          {movie.title}
        </h3>
        <p className="text-xs text-muted-foreground mt-1">{year}</p>
      </div>
    </Link>
  );
};
