import { Link } from "react-router-dom";
import { Genre } from "@/lib/tmdb";
import { cn } from "@/lib/utils";
import {
  Sword,
  Laugh,
  Film,
  Ghost,
  Heart,
  Wand2,
  Rocket,
  History,
  Music2,
  Search,
  Skull,
  Sparkles,
  Tv,
  Shield,
  Bomb,
  Clapperboard,
  Users,
  Baby,
  Zap,
  Drama,
} from "lucide-react";

const genreIcons: Record<number, React.ElementType> = {
  28: Bomb,
  12: Sword,
  16: Sparkles,
  35: Laugh,
  80: Shield,
  99: Film,
  18: Tv,
  10751: Heart,
  14: Wand2,
  36: History,
  27: Ghost,
  10402: Music2,
  9648: Search,
  10749: Heart,
  878: Rocket,
  53: Skull,
  10752: Bomb,
  37: Sword,
  10759: Zap,
  10762: Baby,
  10763: Clapperboard,
  10764: Users,
  10765: Wand2,
  10766: Drama,
  10767: Laugh,
  10768: Shield,
};

const customCategories = [
  { id: "korean", name: "K-Drama", icon: Drama, path: "/search?q=korean" },
  { id: "anime", name: "Anime", icon: Sparkles, path: "/search?q=anime" },
  { id: "bollywood", name: "Bollywood", icon: Film, path: "/search?q=bollywood" },
];

interface GenreButtonsProps {
  genres: Genre[];
  selectedGenre?: number;
  className?: string;
  showAllGenres?: boolean;
}

export const GenreButtons = ({ genres, selectedGenre, className, showAllGenres = false }: GenreButtonsProps) => {
  const displayGenres = showAllGenres ? genres : genres.slice(0, 8);
  
  return (
    <div className={cn("flex flex-wrap gap-2 md:gap-3", className)}>
      {displayGenres.map((genre) => {
        const Icon = genreIcons[genre.id] || Film;
        const isSelected = selectedGenre === genre.id;
        
        return (
          <Link key={genre.id} to={`/genre/${genre.id}`}>
            <button
              className={cn(
                "hbo-pill",
                isSelected && "bg-primary text-primary-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{genre.name}</span>
            </button>
          </Link>
        );
      })}
      
      {customCategories.map((category) => {
        const Icon = category.icon;
        return (
          <Link key={category.id} to={category.path}>
            <button className="hbo-pill border border-primary/30 text-primary">
              <Icon className="h-4 w-4" />
              <span>{category.name}</span>
            </button>
          </Link>
        );
      })}
    </div>
  );
};
