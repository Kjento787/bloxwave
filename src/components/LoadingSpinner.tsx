import { cn } from "@/lib/utils";
import { Waves } from "lucide-react";

interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
}

export const LoadingSpinner = ({ className, size = "md", fullScreen }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-10 w-10",
    lg: "h-16 w-16",
  };

  const spinner = (
    <div className={cn("animate-pulse", className)}>
      <Waves className={cn("text-primary", sizeClasses[size])} />
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export const MovieCardSkeleton = ({ className }: { className?: string }) => (
  <div className={cn("rounded-xl overflow-hidden bg-card", className)}>
    <div className="aspect-[2/3] animate-shimmer" />
    <div className="p-3 space-y-2">
      <div className="h-4 bg-muted rounded animate-shimmer" />
      <div className="h-3 w-1/2 bg-muted rounded animate-shimmer" />
    </div>
  </div>
);

export const HeroBannerSkeleton = () => (
  <div className="h-[70vh] md:h-[85vh] bg-gradient-to-r from-muted to-background animate-pulse" />
);
