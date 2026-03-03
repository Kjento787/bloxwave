import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { motion } from "framer-motion";
import { Film, Tv, Compass, Search, User, Bookmark, LogIn, FileText, Shield, Cookie, AlertTriangle } from "lucide-react";

const footerLinks = {
  browse: [
    { to: "/home", label: "Home", icon: Film },
    { to: "/movies", label: "Movies", icon: Film },
    { to: "/genres", label: "Series", icon: Tv },
    { to: "/hubs", label: "Hubs", icon: Compass },
    { to: "/search", label: "Search", icon: Search },
  ],
  account: [
    { to: "/profile", label: "My Profile", icon: User },
    { to: "/profile", label: "My List", icon: Bookmark },
    { to: "/auth", label: "Sign In", icon: LogIn },
  ],
  legal: [
    { to: "/terms", label: "Terms of Service", icon: FileText },
    { to: "/privacy", label: "Privacy Policy", icon: Shield },
    { to: "/cookies", label: "Cookie Policy", icon: Cookie },
    { to: "/dmca", label: "DMCA", icon: AlertTriangle },
  ],
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-16 md:mt-24">
      {/* Cinematic gradient divider */}
      <div className="relative h-px w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/30 to-transparent blur-sm" />
      </div>

      <div className="bg-background/95 backdrop-blur-sm">
        <motion.div
          className="w-full px-4 md:px-8 lg:px-12 py-12 md:py-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-14 mb-12">
            {/* Brand */}
            <motion.div className="col-span-2 md:col-span-1" variants={itemVariants}>
              <Logo className="mb-5" />
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                Stream unlimited movies and TV shows. Watch anywhere, anytime.
              </p>
              <div className="mt-6 flex items-center gap-2">
                <span className="inline-block h-1 w-8 rounded-full bg-primary/60" />
                <span className="inline-block h-1 w-4 rounded-full bg-primary/30" />
                <span className="inline-block h-1 w-2 rounded-full bg-primary/20" />
              </div>
            </motion.div>

            {/* Browse */}
            <motion.div variants={itemVariants}>
              <h4 className="font-display text-sm uppercase tracking-[0.2em] text-primary mb-5">
                Browse
              </h4>
              <ul className="space-y-3">
                {footerLinks.browse.map(({ to, label, icon: Icon }) => (
                  <li key={`${to}-${label}`}>
                    <Link
                      to={to}
                      className="group flex items-center gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                    >
                      <Icon className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100 transition-opacity duration-300" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Account */}
            <motion.div variants={itemVariants}>
              <h4 className="font-display text-sm uppercase tracking-[0.2em] text-primary mb-5">
                Account
              </h4>
              <ul className="space-y-3">
                {footerLinks.account.map(({ to, label, icon: Icon }) => (
                  <li key={`${to}-${label}`}>
                    <Link
                      to={to}
                      className="group flex items-center gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                    >
                      <Icon className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100 transition-opacity duration-300" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Legal */}
            <motion.div variants={itemVariants}>
              <h4 className="font-display text-sm uppercase tracking-[0.2em] text-primary mb-5">
                Legal
              </h4>
              <ul className="space-y-3">
                {footerLinks.legal.map(({ to, label, icon: Icon }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className="group flex items-center gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                    >
                      <Icon className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100 transition-opacity duration-300" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Bottom Bar */}
          <motion.div variants={itemVariants}>
            <div className="relative h-px w-full overflow-hidden mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-border/40 to-transparent" />
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-xs text-muted-foreground/60">
                © {currentYear} Bloxwave. All rights reserved.
              </p>
              <p className="text-xs text-muted-foreground/60">
                Data provided by{" "}
                <a
                  href="https://www.themoviedb.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary/70 hover:text-primary transition-colors duration-300"
                >
                  TMDB
                </a>
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};
