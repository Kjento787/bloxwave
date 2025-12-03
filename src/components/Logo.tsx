import { Link } from "react-router-dom";
import { Waves } from "lucide-react";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export const Logo = ({ className = "", showText = true }: LogoProps) => {
  return (
    <Link to="/" className={`flex items-center gap-2 group ${className}`}>
      <div className="relative">
        <Waves className="h-8 w-8 text-primary transition-transform duration-300 group-hover:scale-110" />
        <div className="absolute inset-0 blur-lg bg-primary/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      {showText && (
        <span className="text-2xl font-bold tracking-tight">
          <span className="text-gradient">Blox</span>
          <span className="text-foreground">wave</span>
        </span>
      )}
    </Link>
  );
};
