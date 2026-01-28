import { Link } from "react-router-dom";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export const Logo = ({ className = "", showText = true }: LogoProps) => {
  return (
    <Link to="/" className={`flex items-center gap-2 group ${className}`}>
      {/* HBO Max Style Logo */}
      <div className="relative flex items-center justify-center">
        <div className="w-10 h-10 rounded-lg bg-gradient-purple flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
          <span className="text-white font-black text-lg tracking-tighter">B</span>
        </div>
        <div className="absolute inset-0 rounded-lg bg-gradient-purple opacity-0 blur-xl group-hover:opacity-50 transition-opacity duration-300" />
      </div>
      {showText && (
        <span className="text-xl md:text-2xl font-black tracking-tight">
          <span className="text-gradient">BLOX</span>
          <span className="text-foreground">WAVE</span>
        </span>
      )}
    </Link>
  );
};
