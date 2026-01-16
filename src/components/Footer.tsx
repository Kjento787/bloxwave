import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { Github, Twitter, Instagram, Youtube, Heart, ExternalLink } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Youtube, href: "#", label: "Youtube" },
    { icon: Github, href: "#", label: "Github" },
  ];

  return (
    <footer className="relative bg-card border-t border-border mt-16 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 py-12 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="md:col-span-1 space-y-4">
            <Logo className="mb-4" />
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your ultimate destination for streaming movies and TV shows.
              Discover, watch, and enjoy unlimited entertainment.
            </p>
            {/* Social Links */}
            <div className="flex gap-2 pt-2">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  className="p-2.5 rounded-lg bg-secondary/50 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200 hover:scale-110"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Browse Links */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Browse</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { to: "/", label: "Home" },
                { to: "/movies", label: "Movies" },
                { to: "/genres", label: "Genres" },
                { to: "/search", label: "Search" },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link 
                    to={to} 
                    className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group"
                  >
                    {label}
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ExternalLink className="h-3 w-3" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account Links */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Account</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { to: "/profile", label: "My Profile" },
                { to: "/profile", label: "Watch List" },
                { to: "/profile", label: "Continue Watching" },
                { to: "/auth", label: "Sign In" },
              ].map(({ to, label }) => (
                <li key={label}>
                  <Link 
                    to={to} 
                    className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group"
                  >
                    {label}
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ExternalLink className="h-3 w-3" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Legal</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <span className="hover:text-primary transition-colors cursor-pointer">Terms of Service</span>
              </li>
              <li>
                <span className="hover:text-primary transition-colors cursor-pointer">Privacy Policy</span>
              </li>
              <li>
                <span className="hover:text-primary transition-colors cursor-pointer">Cookie Policy</span>
              </li>
              <li>
                <span className="hover:text-primary transition-colors cursor-pointer">DMCA</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>© {currentYear} Bloxwave. Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-red-500 animate-pulse" />
            <span>for movie lovers.</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Movie data provided by</span>
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
            >
              TMDB
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
