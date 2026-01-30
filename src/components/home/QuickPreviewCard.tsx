import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Play, Plus, Check, Star, Info, Volume2, VolumeX, Loader2 } from "lucide-react";
import { Movie, getImageUrl, fetchMovieVideos, fetchTVVideos } from "@/lib/tmdb";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useQuery } from "@tanstack/react-query";

interface QuickPreviewCardProps {
  movie: Movie;
  className?: string;
  style?: React.CSSProperties;
}

export const QuickPreviewCard = ({ movie, className, style }: QuickPreviewCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();

  const isTV = movie.media_type === "tv";
  const contentType = isTV ? "tv" : "movie";
  const detailPath = isTV ? `/tv/${movie.id}` : `/movie/${movie.id}`;
  const title = movie.title || movie.name || "Unknown";
  const year = (movie.release_date || movie.first_air_date)?.split("-")[0] || "";
  const inList = isInWatchlist(movie.id, contentType);
  const isPending = addToWatchlist.isPending || removeFromWatchlist.isPending;

  // Fetch video on hover
  const { data: videoData } = useQuery({
    queryKey: ["video-preview", movie.id, contentType],
    queryFn: () => isTV ? fetchTVVideos(movie.id) : fetchMovieVideos(movie.id),
    enabled: isHovered,
    staleTime: Infinity,
  });

  const trailer = videoData?.results?.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  ) || videoData?.results?.[0];

  const handleMouseEnter = () => {
    hoverTimeoutRef.current = setTimeout(() => setIsHovered(true), 800);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsHovered(false);
  };

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
    <div
      className={cn(
        "group relative flex-shrink-0 w-[160px] sm:w-[180px] md:w-[200px] lg:w-[220px]",
        className
      )}
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link to={detailPath} className="block">
        {/* Main Card */}
        <div className={cn(
          "relative rounded-lg overflow-hidden transition-all duration-300",
          isHovered && "scale-[1.15] z-30 shadow-2xl"
        )}>
          {/* Poster / Video */}
          <div className="aspect-[2/3] relative bg-secondary">
            {!imageLoaded && (
              <div className="absolute inset-0 animate-shimmer" />
            )}
            
            {/* Show video preview on hover if available */}
            {isHovered && trailer ? (
              <div className="absolute inset-0 bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&modestbranding=1&rel=0&showinfo=0`}
                  className="w-full h-full"
                  allow="autoplay"
                  title={title}
                />
                {/* Mute Toggle */}
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-background/60 hover:bg-background/80"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsMuted(!isMuted);
                  }}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
              </div>
            ) : (
              <img
                src={getImageUrl(movie.poster_path, "w500")}
                alt={title}
                className={cn(
                  "w-full h-full object-cover transition-opacity",
                  imageLoaded ? "opacity-100" : "opacity-0"
                )}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
              />
            )}

            {/* Rating Badge */}
            {movie.vote_average > 0 && !isHovered && (
              <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-md bg-background/80 backdrop-blur-sm text-xs font-semibold">
                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                {movie.vote_average.toFixed(1)}
              </div>
            )}
          </div>

          {/* Expanded Info on Hover */}
          {isHovered && (
            <div className="absolute left-0 right-0 -bottom-1 translate-y-full bg-card rounded-b-lg p-3 shadow-2xl animate-fade-in">
              {/* Actions */}
              <div className="flex items-center gap-2 mb-2">
                <Button 
                  size="icon" 
                  className="h-9 w-9 rounded-full bg-foreground text-background hover:bg-foreground/90"
                >
                  <Play className="h-4 w-4 fill-current" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-9 w-9 rounded-full"
                  onClick={toggleWatchList}
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : inList ? (
                    <Check className="h-4 w-4 text-primary" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-9 w-9 rounded-full ml-auto"
                >
                  <Info className="h-4 w-4" />
                </Button>
              </div>

              {/* Title */}
              <h3 className="font-semibold text-sm line-clamp-1 mb-1">{title}</h3>
              
              {/* Meta */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="text-green-500 font-semibold">
                  {Math.round(movie.vote_average * 10)}% Match
                </span>
                <span>{year}</span>
                <span className="px-1 border border-muted-foreground/50 rounded text-[10px]">HD</span>
              </div>
            </div>
          )}
        </div>
      </Link>

      {/* Title Below - Only when not hovered */}
      {!isHovered && (
        <div className="mt-2 px-1">
          <h3 className="font-medium text-sm line-clamp-1">{title}</h3>
          <p className="text-xs text-muted-foreground">{year}</p>
        </div>
      )}
    </div>
  );
};