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
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div className="relative">
        <Waves className={cn("text-primary animate-pulse", sizeClasses[size])} />
        <div className="absolute inset-0 animate-ping">
          <Waves className={cn("text-primary/30", sizeClasses[size])} />
        </div>
      </div>
      <span className="text-sm text-muted-foreground animate-pulse">Loading...</span>
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
    <div className="aspect-[2/3] bg-muted relative overflow-hidden">
      <div className="absolute inset-0 animate-shimmer" />
    </div>
    <div className="p-3 space-y-2">
      <div className="h-4 bg-muted rounded relative overflow-hidden">
        <div className="absolute inset-0 animate-shimmer" />
      </div>
      <div className="h-3 w-1/2 bg-muted rounded relative overflow-hidden">
        <div className="absolute inset-0 animate-shimmer" />
      </div>
    </div>
  </div>
);

export const HeroBannerSkeleton = () => (
  <div className="h-[70vh] md:h-[85vh] relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-muted via-secondary to-muted animate-shimmer" />
    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
    <div className="absolute bottom-32 left-8 space-y-4">
      <div className="h-12 w-80 bg-muted/50 rounded relative overflow-hidden">
        <div className="absolute inset-0 animate-shimmer" />
      </div>
      <div className="h-6 w-48 bg-muted/50 rounded relative overflow-hidden">
        <div className="absolute inset-0 animate-shimmer" />
      </div>
      <div className="h-20 w-[500px] max-w-full bg-muted/30 rounded relative overflow-hidden">
        <div className="absolute inset-0 animate-shimmer" />
      </div>
      <div className="flex gap-4">
        <div className="h-12 w-36 bg-primary/20 rounded-lg relative overflow-hidden">
          <div className="absolute inset-0 animate-shimmer" />
        </div>
        <div className="h-12 w-36 bg-muted/50 rounded-lg relative overflow-hidden">
          <div className="absolute inset-0 animate-shimmer" />
        </div>
      </div>
    </div>
  </div>
);

export const CarouselSkeleton = ({ title }: { title?: string }) => (
  <div className="space-y-4 px-4 md:px-0">
    {title && <div className="h-7 w-48 bg-muted rounded relative overflow-hidden">
      <div className="absolute inset-0 animate-shimmer" />
    </div>}
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: 6 }).map((_, i) => (
        <MovieCardSkeleton key={i} className="flex-shrink-0 w-40 md:w-48" />
      ))}
    </div>
  </div>
);
