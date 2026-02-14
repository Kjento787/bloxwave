import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, User, Menu, X, LogOut, Shield, Bookmark } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { toast } from "sonner";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
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

  const activeProfile = (() => {
    try {
      const stored = localStorage.getItem("activeViewerProfile");
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  })();

  const navLinks = [
    { href: "/home", label: "Home" },
    { href: "/movies", label: "Movies" },
    { href: "/genres", label: "Series" },
    { href: "/hubs", label: "Hubs" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "bg-background/95 backdrop-blur-xl border-b border-border/30"
          : "bg-gradient-to-b from-background/90 via-background/50 to-transparent"
      )}
    >
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16 md:h-18">
          <Logo size="sm" />

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center justify-center flex-1 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn("hbo-nav-link", isActive(link.href) && "active text-foreground")}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-1 md:gap-2">
            {/* Search */}
            <div className="relative">
              {searchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center animate-scale-in">
                  <Input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-40 md:w-56 h-9 bg-secondary/80 border-0 focus:ring-1 focus:ring-primary rounded-full text-sm"
                    autoFocus
                  />
                  <Button type="button" variant="ghost" size="icon" className="h-9 w-9 ml-1 rounded-full" onClick={() => { setSearchOpen(false); setSearchQuery(""); }}>
                    <X className="h-4 w-4" />
                  </Button>
                </form>
              ) : (
                <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)} className="h-9 w-9 rounded-full hover:bg-secondary/50">
                  <Search className="h-5 w-5" />
                </Button>
              )}
            </div>

            <div className="hidden md:block"><ThemeToggle /></div>

            {user && (
              <Link to="/profile" className="hidden md:block">
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-secondary/50" title="My List">
                  <Bookmark className="h-5 w-5" />
                </Button>
              </Link>
            )}

            {user ? (
              <>
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-secondary/50" title="Admin">
                      <Shield className="h-5 w-5 text-primary" />
                    </Button>
                  </Link>
                )}
                {/* Profile switcher */}
                <Link to="/profiles">
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-secondary/50" title={activeProfile?.name || "Switch Profile"}>
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden md:flex h-9 w-9 rounded-full hover:bg-secondary/50"
                  onClick={handleSignOut}
                  title="Sign Out"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <Link to="/">
                <Button className="hidden md:flex h-9 px-4 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-semibold">
                  Sign In
                </Button>
              </Link>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9 rounded-full"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/30 animate-fade-in">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-lg text-base font-medium transition-colors",
                    isActive(link.href) ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-muted-foreground">Theme</span>
                <ThemeToggle />
              </div>

              {user ? (
                <>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-lg text-base font-medium text-primary hover:bg-secondary/50 flex items-center gap-2">
                      <Shield className="h-4 w-4" /> Admin Panel
                    </Link>
                  )}
                  <Link to="/profiles" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-lg text-base font-medium text-muted-foreground hover:bg-secondary/50 flex items-center gap-2">
                    <User className="h-4 w-4" /> Switch Profile
                  </Link>
                  <button onClick={() => { handleSignOut(); setMobileMenuOpen(false); }} className="px-4 py-3 rounded-lg text-base font-medium text-muted-foreground hover:bg-secondary/50 text-left flex items-center gap-2">
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </>
              ) : (
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="mx-4 mt-2 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-center">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
