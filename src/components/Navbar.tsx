import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, User, Menu, X, LogOut, Shield, Bookmark, Film, Tv, Compass, LayoutGrid, TrendingUp, Clock, Star } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const megaMenuItems = [
{
  label: "Movies",
  href: "/movies",
  icon: Film,
  description: "Browse all movies",
  children: [
  { label: "Trending", href: "/movies", icon: TrendingUp },
  { label: "Top Rated", href: "/genres", icon: Star },
  { label: "Coming Soon", href: "/movies", icon: Clock }]

},
{
  label: "Series",
  href: "/genres",
  icon: Tv,
  description: "TV Shows & Series",
  children: [
  { label: "Popular", href: "/genres", icon: TrendingUp },
  { label: "Genres", href: "/genres", icon: LayoutGrid }]

},
{
  label: "Hubs",
  href: "/hubs",
  icon: Compass,
  description: "Genre collections",
  children: [
  { label: "Action", href: "/genre/28", icon: Film },
  { label: "Comedy", href: "/genre/35", icon: Film },
  { label: "Horror", href: "/genre/27", icon: Film },
  { label: "Sci-Fi", href: "/genre/878", icon: Film }]

}];


export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const menuTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setTimeout(() => checkAdminStatus(session.user.id), 0);
      } else {
        setIsAdmin(false);
      }
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) checkAdminStatus(session.user.id);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setActiveMenu(null);
  }, [location.pathname]);

  const checkAdminStatus = async (userId: string) => {
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin");
    setIsAdmin(data && data.length > 0);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("activeViewerProfile");
    toast.success("Signed out successfully");
    navigate("/");
  };

  const handleMenuEnter = (label: string) => {
    clearTimeout(menuTimeoutRef.current);
    setActiveMenu(label);
  };

  const handleMenuLeave = () => {
    menuTimeoutRef.current = setTimeout(() => setActiveMenu(null), 200);
  };

  const activeProfile = (() => {
    try {
      const stored = localStorage.getItem("activeViewerProfile");
      return stored ? JSON.parse(stored) : null;
    } catch {return null;}
  })();

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-700",
          isScrolled ?
          "bg-background/80 backdrop-blur-2xl border-b border-border/20 shadow-lg shadow-background/20" :
          "bg-gradient-to-b from-background/80 via-background/30 to-transparent"
        )}>

        <div className="w-full px-4 md:px-8 lg:px-12">
          <div className="flex items-center justify-between h-16 md:h-[72px]">
            {/* Logo */}
            <Logo size="sm" />

            {/* Desktop Nav — Mega Menu */}
            <div className="hidden md:flex items-center justify-center flex-1">
              <div className="flex items-center gap-0.5">
                <Link
                  to="/home"
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                    isActive("/home") ?
                    "text-primary bg-primary/10" :
                    "text-foreground/60 hover:text-foreground hover:bg-foreground/5"
                  )}>

                  site under development | Home
                </Link>

                {megaMenuItems.map((item) =>
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => handleMenuEnter(item.label)}
                  onMouseLeave={handleMenuLeave}>

                    <Link
                    to={item.href}
                    className={cn(
                      "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-1",
                      isActive(item.href) ?
                      "text-primary bg-primary/10" :
                      "text-foreground/60 hover:text-foreground hover:bg-foreground/5"
                    )}>

                      {item.label}
                    </Link>

                    {/* Mega Menu Dropdown */}
                    <AnimatePresence>
                      {activeMenu === item.label &&
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.98 }}
                      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50"
                      onMouseEnter={() => handleMenuEnter(item.label)}
                      onMouseLeave={handleMenuLeave}>

                          <div className="bg-card/95 backdrop-blur-2xl border border-border/40 rounded-xl p-3 shadow-2xl min-w-[200px]">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2 px-2">
                              {item.description}
                            </p>
                            {item.children.map((child) =>
                        <Link
                          key={child.label}
                          to={child.href}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-foreground/70 hover:text-foreground hover:bg-primary/10 transition-colors">

                                <child.icon className="h-3.5 w-3.5 text-primary/70" />
                                {child.label}
                              </Link>
                        )}
                          </div>
                        </motion.div>
                    }
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-1.5">
              {/* Search Trigger */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(true)}
                className="h-9 w-9 rounded-full hover:bg-foreground/10">

                <Search className="h-[18px] w-[18px]" />
              </Button>

              <div className="hidden md:block">
                <ThemeToggle />
              </div>

              {user &&
              <Link to="/profile" className="hidden md:block">
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-foreground/10" title="My List">
                    <Bookmark className="h-[18px] w-[18px]" />
                  </Button>
                </Link>
              }

              {user ?
              <>
                  {isAdmin &&
                <Link to="/admin">
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-foreground/10" title="Admin">
                        <Shield className="h-[18px] w-[18px] text-primary" />
                      </Button>
                    </Link>
                }
                  <Link to="/profiles">
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-foreground/10 border border-foreground/10" title={activeProfile?.name || "Switch Profile"}>
                      <User className="h-[18px] w-[18px]" />
                    </Button>
                  </Link>
                  <Button
                  variant="ghost"
                  size="icon"
                  className="hidden md:flex h-9 w-9 rounded-full hover:bg-foreground/10"
                  onClick={handleSignOut}
                  title="Sign Out">

                    <LogOut className="h-[18px] w-[18px]" />
                  </Button>
                </> :

              <Link to="/">
                  <Button className="hidden md:flex h-9 px-5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold uppercase tracking-wider">
                    Sign In
                  </Button>
                </Link>
              }

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-9 w-9 rounded-full"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>

                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* ===== Full-Screen Search Overlay ===== */}
      <AnimatePresence>
        {searchOpen &&
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-3xl flex flex-col">

            {/* Close */}
            <div className="flex justify-end p-4 md:p-8">
              <Button
              variant="ghost"
              size="icon"
              onClick={() => {setSearchOpen(false);setSearchQuery("");}}
              className="h-12 w-12 rounded-full border border-foreground/10 hover:bg-foreground/10">

                <X className="h-6 w-6" />
              </Button>
            </div>

            {/* Search Form */}
            <div className="flex-1 flex items-start justify-center pt-[15vh]">
              <div className="w-full max-w-2xl px-6">
                <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>

                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">
                    Search movies, shows & more
                  </p>
                  <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-6 md:h-8 md:w-8 text-muted-foreground" />
                    <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="What are you looking for?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent border-0 border-b-2 border-foreground/10 focus:border-primary pl-10 md:pl-14 pb-4 text-2xl md:text-4xl font-display font-light text-foreground placeholder:text-foreground/20 outline-none transition-colors" />

                  </form>

                  {/* Quick Links */}
                  <div className="mt-10 flex flex-wrap gap-2">
                    <span className="text-xs text-muted-foreground mr-2 pt-1">Quick:</span>
                    {["Action", "Comedy", "Horror", "Sci-Fi", "Romance", "Anime"].map((genre) =>
                  <Link
                    key={genre}
                    to={`/search?q=${genre}`}
                    onClick={() => {setSearchOpen(false);setSearchQuery("");}}
                    className="px-4 py-1.5 rounded-full text-xs font-medium border border-foreground/10 text-foreground/60 hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all">

                        {genre}
                      </Link>
                  )}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        }
      </AnimatePresence>

      {/* ===== Mobile Menu Drawer ===== */}
      <AnimatePresence>
        {mobileMenuOpen &&
        <>
            {/* Backdrop */}
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[55] bg-background/60 backdrop-blur-sm md:hidden"
            onClick={() => setMobileMenuOpen(false)} />

            {/* Drawer */}
            <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-[56] w-[80%] max-w-xs bg-card/98 backdrop-blur-2xl border-l border-border/30 md:hidden overflow-y-auto">

              <div className="p-6 pt-20">
                <div className="flex flex-col gap-1">
                  <Link
                  to="/home"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium transition-all",
                    isActive("/home") ? "bg-primary/10 text-primary" : "text-foreground/70 hover:bg-foreground/5"
                  )}>

                    Home
                  </Link>

                  {megaMenuItems.map((item) =>
                <div key={item.label}>
                      <Link
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium transition-all",
                      isActive(item.href) ? "bg-primary/10 text-primary" : "text-foreground/70 hover:bg-foreground/5"
                    )}>

                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    </div>
                )}

                  <div className="h-px bg-border/30 my-3" />

                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm text-muted-foreground">Theme</span>
                    <ThemeToggle />
                  </div>

                  {user ?
                <>
                      {isAdmin &&
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium text-primary hover:bg-primary/5">
                          <Shield className="h-4 w-4" /> Admin
                        </Link>
                  }
                      <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium text-foreground/70 hover:bg-foreground/5">
                        <Bookmark className="h-4 w-4" /> My List
                      </Link>
                      <Link to="/profiles" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium text-foreground/70 hover:bg-foreground/5">
                        <User className="h-4 w-4" /> Switch Profile
                      </Link>
                      <button onClick={() => {handleSignOut();setMobileMenuOpen(false);}} className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium text-foreground/70 hover:bg-foreground/5 w-full text-left">
                        <LogOut className="h-4 w-4" /> Sign Out
                      </button>
                    </> :

                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="mx-2 mt-4 py-3.5 rounded-full bg-primary text-primary-foreground font-bold text-center uppercase tracking-wider text-sm">
                      Sign In
                    </Link>
                }
                </div>
              </div>
            </motion.div>
          </>
        }
      </AnimatePresence>
    </>);

};