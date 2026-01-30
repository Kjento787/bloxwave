import { Link } from "react-router-dom";
import { Movie, getImageUrl } from "@/lib/tmdb";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface HubSectionProps {
  title: string;
  icon: LucideIcon;
  movies: Movie[];
  genreId?: number;
  searchQuery?: string;
  accentColor?: string;
  className?: string;
}

export const HubSection = ({ 
  title, 
  icon: Icon, 
  movies, 
  genreId,
  searchQuery,
  accentColor = "hsl(var(--primary))",
  className 
}: HubSectionProps) => {
  const displayMovies = movies.slice(0, 6);
  const linkPath = genreId ? `/genre/${genreId}` : searchQuery ? `/search?q=${searchQuery}` : "/movies";

  if (!displayMovies.length) return null;

  return (
    <section className={cn("px-4 md:px-8 lg:px-12", className)}>
      {/* Hub Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="p-2.5 rounded-lg"
            style={{ backgroundColor: `${accentColor}20` }}
          >
            <Icon className="h-5 w-5 md:h-6 md:w-6" style={{ color: accentColor }} />
          </div>
          <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
        </div>
        <Link 
          to={linkPath}
          className="text-sm font-medium text-primary hover:underline"
        >
          See All
        </Link>
      </div>

      {/* Hub Grid - Different Layout */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3">
        {displayMovies.map((movie, index) => {
          const isTV = movie.media_type === "tv";
          const detailPath = isTV ? `/tv/${movie.id}` : `/movie/${movie.id}`;
          
          return (
            <Link
              key={movie.id}
              to={detailPath}
              className={cn(
                "group relative rounded-lg overflow-hidden aspect-[2/3]",
                "transition-all duration-300 hover:scale-105 hover:z-10 hover:shadow-hover"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <img
                src={getImageUrl(movie.poster_path, "w500")}
                alt={movie.title || movie.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="font-semibold text-sm line-clamp-2">{movie.title || movie.name}</h3>
                </div>
              </div>

              {/* Accent Border on Hover */}
              <div 
                className="absolute inset-0 rounded-lg border-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style={{ borderColor: accentColor }}
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
};