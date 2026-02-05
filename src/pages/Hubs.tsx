import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Link } from "react-router-dom";
import { PageTransition } from "@/components/PageTransition";
import { 
  Swords, 
  Laugh, 
  Ghost, 
  Rocket, 
  Heart, 
  Sparkles, 
  Drama,
  Mountain,
  Music,
  Baby,
  Clapperboard,
  Scroll,
  Skull,
  Compass
} from "lucide-react";
import { discoverMovies, discoverTV, getImageUrl } from "@/lib/tmdb";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface HubData {
  id: number;
  name: string;
  icon: LucideIcon;
  color: string;
  gradient: string;
  genreId: number;
  isTV?: boolean;
}

const hubs: HubData[] = [
  { id: 1, name: "Action", icon: Swords, color: "hsl(0, 84%, 60%)", gradient: "from-red-600 to-orange-500", genreId: 28 },
  { id: 2, name: "Comedy", icon: Laugh, color: "hsl(45, 93%, 47%)", gradient: "from-yellow-500 to-amber-400", genreId: 35 },
  { id: 3, name: "Horror", icon: Ghost, color: "hsl(270, 50%, 40%)", gradient: "from-purple-800 to-violet-600", genreId: 27 },
  { id: 4, name: "Sci-Fi", icon: Rocket, color: "hsl(200, 100%, 50%)", gradient: "from-cyan-500 to-blue-600", genreId: 878 },
  { id: 5, name: "Romance", icon: Heart, color: "hsl(340, 82%, 52%)", gradient: "from-pink-500 to-rose-400", genreId: 10749 },
  { id: 6, name: "Anime", icon: Sparkles, color: "hsl(280, 100%, 60%)", gradient: "from-purple-500 to-pink-500", genreId: 16, isTV: true },
  { id: 7, name: "Drama", icon: Drama, color: "hsl(220, 70%, 50%)", gradient: "from-blue-600 to-indigo-500", genreId: 18 },
  { id: 8, name: "Adventure", icon: Compass, color: "hsl(140, 70%, 40%)", gradient: "from-emerald-600 to-green-500", genreId: 12 },
  { id: 9, name: "Thriller", icon: Skull, color: "hsl(0, 0%, 30%)", gradient: "from-gray-800 to-gray-600", genreId: 53 },
  { id: 10, name: "Documentary", icon: Clapperboard, color: "hsl(30, 60%, 50%)", gradient: "from-amber-600 to-yellow-500", genreId: 99 },
  { id: 11, name: "Music", icon: Music, color: "hsl(280, 80%, 60%)", gradient: "from-violet-500 to-purple-400", genreId: 10402 },
  { id: 12, name: "Family", icon: Baby, color: "hsl(180, 60%, 50%)", gradient: "from-teal-500 to-cyan-400", genreId: 10751 },
  { id: 13, name: "Fantasy", icon: Mountain, color: "hsl(260, 60%, 50%)", gradient: "from-indigo-600 to-purple-500", genreId: 14 },
  { id: 14, name: "History", icon: Scroll, color: "hsl(25, 50%, 45%)", gradient: "from-amber-700 to-orange-500", genreId: 36 },
];

const HubCard = ({ hub }: { hub: HubData }) => {
  const { data } = useQuery({
    queryKey: ["hub-preview", hub.genreId, hub.isTV],
    queryFn: () => hub.isTV 
      ? discoverTV({ withGenres: String(hub.genreId), sortBy: "popularity.desc" })
      : discoverMovies({ withGenres: String(hub.genreId), sortBy: "popularity.desc" }),
  });

  const Icon = hub.icon;
  const previewMovies = data?.results?.slice(0, 4) || [];

  return (
    <Link
      to={`/genre/${hub.genreId}`}
      className="group relative rounded-2xl overflow-hidden aspect-[4/3] transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl"
    >
      {/* Background Images Grid */}
      <div className="absolute inset-0 grid grid-cols-2 gap-0.5 opacity-60">
        {previewMovies.map((movie, i) => (
          <div key={movie.id} className="relative overflow-hidden">
            <img
              src={getImageUrl(movie.poster_path, "w300")}
              alt=""
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* Gradient Overlay */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-t opacity-90 transition-opacity duration-300 group-hover:opacity-80",
        hub.gradient
      )} />

      {/* Dark Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
        <div 
          className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm mb-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-white/20"
        >
          <Icon className="h-10 w-10 md:h-12 md:w-12 text-white" />
        </div>
        <h3 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
          {hub.name}
        </h3>
        <p className="text-white/70 text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Explore {hub.name} content →
        </p>
      </div>

      {/* Hover Border Effect */}
      <div 
        className="absolute inset-0 rounded-2xl border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ borderColor: hub.color }}
      />
    </Link>
  );
};

const Hubs = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navbar />
        
        {/* Hero Header */}
        <div className="relative pt-20 pb-12 px-4 md:px-8 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-400 to-pink-500 bg-clip-text text-transparent">
              Browse by Hub
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Dive into curated collections organized by genre. Find your next favorite movie or show.
            </p>
          </div>
        </div>

        {/* Hubs Grid */}
        <main className="px-4 md:px-8 lg:px-12 pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {hubs.map((hub) => (
              <HubCard key={hub.id} hub={hub} />
            ))}
          </div>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default Hubs;
