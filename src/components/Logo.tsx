import { Link } from "react-router-dom";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export const Logo = ({ className = "", showText = true, size = "md" }: LogoProps) => {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-xl md:text-2xl",
    lg: "text-3xl md:text-4xl"
  };

  return (
    <Link to="/" className={`flex items-center gap-2 group ${className}`}>
      <span className={`font-black tracking-[0.2em] uppercase ${sizeClasses[size]}`}>
        <span className="text-gradient">BLOX</span>
        <span className="text-foreground">WAVE            </span>
      </span>
    </Link>);

};