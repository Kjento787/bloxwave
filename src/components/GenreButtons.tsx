import { Link } from "react-router-dom";
import { Genre } from "@/lib/tmdb";
import { Button } from "./ui/button";
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
} from "lucide-react";

const genreIcons: Record<number, React.ElementType> = {
  28: Bomb, // Action
  12: Sword, // Adventure
  16: Sparkles, // Animation
  35: Laugh, // Comedy
  80: Shield, // Crime
  99: Film, // Documentary
  18: Tv, // Drama
  10751: Heart, // Family
  14: Wand2, // Fantasy
  36: History, // History
  27: Ghost, // Horror
  10402: Music2, // Music
  9648: Search, // Mystery
  10749: Heart, // Romance
  878: Rocket, // Science Fiction
  53: Skull, // Thriller
  10752: Bomb, // War
  37: Sword, // Western
};

interface GenreButtonsProps {
  genres: Genre[];
  selectedGenre?: number;
  className?: string;
}

export const GenreButtons = ({ genres, selectedGenre, className }: GenreButtonsProps) => {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {genres.slice(0, 12).map((genre) => {
        const Icon = genreIcons[genre.id] || Film;
        const isSelected = selectedGenre === genre.id;
        
        return (
          <Link key={genre.id} to={`/genre/${genre.id}`}>
            <Button
              variant={isSelected ? "default" : "genre"}
              size="sm"
              className={cn(
                "transition-all duration-200",
                isSelected && "shadow-glow"
              )}
            >
              <Icon className="h-4 w-4" />
              {genre.name}
            </Button>
          </Link>
        );
      })}
    </div>
  );
};
