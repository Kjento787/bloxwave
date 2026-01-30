import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Smile, 
  Zap, 
  Brain, 
  Heart, 
  Ghost, 
  Sparkles,
  Flame,
  Moon
} from "lucide-react";

interface Mood {
  id: string;
  name: string;
  icon: React.ElementType;
  keywords: string;
  gradient: string;
}

const moods: Mood[] = [
  { 
    id: "feel-good", 
    name: "Feel Good", 
    icon: Smile, 
    keywords: "comedy feel good happy",
    gradient: "from-yellow-500 to-orange-500"
  },
  { 
    id: "thrilling", 
    name: "Thrilling", 
    icon: Zap, 
    keywords: "thriller suspense action",
    gradient: "from-red-500 to-rose-600"
  },
  { 
    id: "mind-bending", 
    name: "Mind-Bending", 
    icon: Brain, 
    keywords: "psychological mystery twist",
    gradient: "from-purple-500 to-violet-600"
  },
  { 
    id: "romantic", 
    name: "Romantic", 
    icon: Heart, 
    keywords: "romance love relationship",
    gradient: "from-pink-500 to-rose-500"
  },
  { 
    id: "spooky", 
    name: "Spooky", 
    icon: Ghost, 
    keywords: "horror scary supernatural",
    gradient: "from-slate-600 to-slate-800"
  },
  { 
    id: "fantasy", 
    name: "Fantastical", 
    icon: Sparkles, 
    keywords: "fantasy magic adventure",
    gradient: "from-cyan-500 to-blue-600"
  },
  { 
    id: "intense", 
    name: "Intense", 
    icon: Flame, 
    keywords: "drama intense emotional",
    gradient: "from-orange-600 to-red-700"
  },
  { 
    id: "chill", 
    name: "Chill Night", 
    icon: Moon, 
    keywords: "documentary slow calm",
    gradient: "from-indigo-500 to-blue-700"
  },
];

interface MoodBrowserProps {
  className?: string;
}

export const MoodBrowser = ({ className }: MoodBrowserProps) => {
  return (
    <section className={cn("px-4 md:px-8 lg:px-12", className)}>
      <h2 className="text-xl md:text-2xl font-bold mb-4">Browse by Mood</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 md:gap-3">
        {moods.map((mood, index) => {
          const Icon = mood.icon;
          return (
            <Link
              key={mood.id}
              to={`/search?q=${encodeURIComponent(mood.keywords)}`}
              className={cn(
                "group relative flex flex-col items-center justify-center gap-2 p-4 md:p-5 rounded-xl",
                "bg-gradient-to-br transition-all duration-300",
                "hover:scale-105 hover:shadow-lg",
                mood.gradient
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Icon className="h-6 w-6 md:h-8 md:w-8 text-white drop-shadow-md" />
              <span className="text-xs md:text-sm font-semibold text-white text-center drop-shadow-md">
                {mood.name}
              </span>
              
              {/* Glow Effect on Hover */}
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl -z-10 bg-inherit" />
            </Link>
          );
        })}
      </div>
    </section>
  );
};