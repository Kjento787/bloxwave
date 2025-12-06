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
  Clapperboard,
  Users,
  Baby,
  Zap,
  Drama,
} from "lucide-react";

// Movie genre icons
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
  // TV genre IDs
  10759: Zap, // Action & Adventure (TV)
  10762: Baby, // Kids (TV)
  10763: Clapperboard, // News (TV)
  10764: Users, // Reality (TV)
  10765: Wand2, // Sci-Fi & Fantasy (TV)
  10766: Drama, // Soap (TV)
  10767: Laugh, // Talk (TV)
  10768: Shield, // War & Politics (TV)
};

// Additional custom categories for browsing
const customCategories = [
  { id: "korean", name: "K-Drama", icon: Drama, path: "/search?q=korean" },
  { id: "anime", name: "Anime", icon: Sparkles, path: "/search?q=anime" },
  { id: "bollywood", name: "Bollywood", icon: Film, path: "/search?q=bollywood" },
  { id: "chinese", name: "C-Drama", icon: Drama, path: "/search?q=chinese drama" },
  { id: "thai", name: "Thai Drama", icon: Heart, path: "/search?q=thai drama" },
  { id: "turkish", name: "Turkish", icon: Drama, path: "/search?q=turkish series" },
];

interface GenreButtonsProps {
  genres: Genre[];
  selectedGenre?: number;
  className?: string;
  showAllGenres?: boolean;
}

export const GenreButtons = ({ genres, selectedGenre, className, showAllGenres = false }: GenreButtonsProps) => {
  const displayGenres = showAllGenres ? genres : genres.slice(0, 10);
  
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {displayGenres.map((genre) => {
        const Icon = genreIcons[genre.id] || Film;
        const isSelected = selectedGenre === genre.id;
        
        return (
          <Link key={genre.id} to={`/genre/${genre.id}`}>
            <Button
              variant={isSelected ? "default" : "glass"}
              size="sm"
              className={cn(
                "transition-all duration-200 backdrop-blur-md",
                isSelected && "shadow-glow"
              )}
            >
              <Icon className="h-4 w-4" />
              {genre.name}
            </Button>
          </Link>
        );
      })}
      
      {/* Custom categories like K-Drama, Anime, etc. */}
      {customCategories.map((category) => {
        const Icon = category.icon;
        
        return (
          <Link key={category.id} to={category.path}>
            <Button
              variant="glass"
              size="sm"
              className="transition-all duration-200 backdrop-blur-md border-primary/30 text-primary hover:bg-primary/20"
            >
              <Icon className="h-4 w-4" />
              {category.name}
            </Button>
          </Link>
        );
      })}
    </div>
  );
};
