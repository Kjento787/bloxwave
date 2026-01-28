import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
}

export const LoadingSpinner = ({ className, size = "md", fullScreen }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "h-5 w-5",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const spinner = (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <Loader2 className={cn("text-primary animate-spin", sizeClasses[size])} />
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
  <div className={cn("rounded-lg overflow-hidden bg-card", className)}>
    <div className="aspect-[2/3] bg-secondary relative overflow-hidden rounded-lg">
      <div className="absolute inset-0 animate-shimmer" />
    </div>
    <div className="p-2 space-y-2">
      <div className="h-4 bg-secondary rounded relative overflow-hidden">
        <div className="absolute inset-0 animate-shimmer" />
      </div>
      <div className="h-3 w-1/2 bg-secondary rounded relative overflow-hidden">
        <div className="absolute inset-0 animate-shimmer" />
      </div>
    </div>
  </div>
);

export const HeroBannerSkeleton = () => (
  <div className="h-[85vh] md:h-screen relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-secondary via-muted to-secondary animate-shimmer" />
    <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
    <div className="absolute bottom-1/3 left-4 md:left-8 lg:left-12 space-y-4">
      <div className="h-12 md:h-16 w-64 md:w-96 bg-secondary/50 rounded relative overflow-hidden">
        <div className="absolute inset-0 animate-shimmer" />
      </div>
      <div className="h-4 w-32 bg-secondary/50 rounded relative overflow-hidden">
        <div className="absolute inset-0 animate-shimmer" />
      </div>
      <div className="h-16 w-80 md:w-[500px] max-w-full bg-secondary/30 rounded relative overflow-hidden">
        <div className="absolute inset-0 animate-shimmer" />
      </div>
      <div className="flex gap-3">
        <div className="h-12 w-32 bg-foreground/20 rounded-md relative overflow-hidden">
          <div className="absolute inset-0 animate-shimmer" />
        </div>
        <div className="h-12 w-36 bg-secondary/50 rounded-md relative overflow-hidden">
          <div className="absolute inset-0 animate-shimmer" />
        </div>
      </div>
    </div>
  </div>
);

export const CarouselSkeleton = ({ title }: { title?: string }) => (
  <div className="space-y-4 px-4 md:px-8 lg:px-12">
    {title && <div className="h-6 w-40 bg-secondary rounded relative overflow-hidden">
      <div className="absolute inset-0 animate-shimmer" />
    </div>}
    <div className="flex gap-2 md:gap-3 overflow-hidden">
      {Array.from({ length: 8 }).map((_, i) => (
        <MovieCardSkeleton key={i} className="flex-shrink-0 w-32 sm:w-36 md:w-40 lg:w-44" />
      ))}
    </div>
  </div>
);
