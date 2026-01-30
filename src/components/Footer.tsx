import { Link } from "react-router-dom";
import { Logo } from "./Logo";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const links = {
    browse: [
      { to: "/", label: "Home" },
      { to: "/movies", label: "Movies" },
      { to: "/genres", label: "Series" },
      { to: "/search", label: "Search" },
    ],
    account: [
      { to: "/profile", label: "My Profile" },
      { to: "/profile", label: "My List" },
      { to: "/auth", label: "Sign In" },
    ],
    legal: [
      { to: "/terms", label: "Terms of Service" },
      { to: "/privacy", label: "Privacy Policy" },
      { to: "/cookies", label: "Cookie Policy" },
      { to: "/dmca", label: "DMCA" },
    ],
  };

  return (
    <footer className="relative mt-16 md:mt-24">
      {/* Top Gradient Fade */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-background pointer-events-none -translate-y-full" />
      
      <div className="bg-background border-t border-border/20">
        <div className="w-full px-4 md:px-8 lg:px-12 py-10 md:py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 mb-10">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <Logo className="mb-4" />
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                Stream unlimited movies and TV shows. Watch anywhere, anytime.
              </p>
            </div>

            {/* Browse */}
            <div>
              <h4 className="font-semibold mb-4 text-xs uppercase tracking-widest text-muted-foreground">
                Browse
              </h4>
              <ul className="space-y-2.5">
                {links.browse.map(({ to, label }) => (
                  <li key={`${to}-${label}`}>
                    <Link 
                      to={to} 
                      className="text-sm text-foreground/60 hover:text-foreground transition-colors duration-200"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Account */}
            <div>
              <h4 className="font-semibold mb-4 text-xs uppercase tracking-widest text-muted-foreground">
                Account
              </h4>
              <ul className="space-y-2.5">
                {links.account.map(({ to, label }) => (
                  <li key={`${to}-${label}`}>
                    <Link 
                      to={to} 
                      className="text-sm text-foreground/60 hover:text-foreground transition-colors duration-200"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-4 text-xs uppercase tracking-widest text-muted-foreground">
                Legal
              </h4>
              <ul className="space-y-2.5">
                {links.legal.map(({ to, label }) => (
                  <li key={to}>
                    <Link 
                      to={to} 
                      className="text-sm text-foreground/60 hover:text-foreground transition-colors duration-200"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-border/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">
              © {currentYear} Bloxwave. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Data provided by{" "}
              <a 
                href="https://www.themoviedb.org/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-primary hover:underline"
              >
                TMDB
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
