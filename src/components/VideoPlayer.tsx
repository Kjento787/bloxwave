import { useState, useRef, useEffect } from "react";
import { X, Maximize, Minimize, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  embedUrl: string;
  title: string;
  subtitle?: string;
  onClose: () => void;
}

export const VideoPlayer = ({ embedUrl, title, subtitle, onClose }: VideoPlayerProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const playerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = async () => {
    if (!playerRef.current) return;

    if (!document.fullscreenElement) {
      await playerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !document.fullscreenElement) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div ref={playerRef} className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary/10 text-primary text-xs">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Ad-Protected</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold">{title}</h2>
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="glass" size="icon" onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
          </Button>
          <Button variant="glass" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Video Container with Ad Blocking */}
      <div className="flex-1 w-full relative overflow-hidden video-player-container">
        {/* Loading state */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
              <p className="text-muted-foreground">Loading player...</p>
            </div>
          </div>
        )}

        {/* Iframe with restricted permissions */}
        <iframe
          src={embedUrl}
          className={cn(
            "w-full h-full transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100"
          )}
          allowFullScreen
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          referrerPolicy="origin"
          onLoad={() => setIsLoading(false)}
          style={{ 
            border: 'none',
            display: 'block'
          }}
          sandbox="allow-scripts allow-same-origin allow-forms allow-presentation allow-orientation-lock allow-popups-to-escape-sandbox"
        />

        {/* Overlay to block popups/ads on edges */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-transparent pointer-events-auto" onClick={(e) => e.stopPropagation()} />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-transparent pointer-events-auto" onClick={(e) => e.stopPropagation()} />
        <div className="absolute top-0 bottom-0 left-0 w-1 bg-transparent pointer-events-auto" onClick={(e) => e.stopPropagation()} />
        <div className="absolute top-0 bottom-0 right-0 w-1 bg-transparent pointer-events-auto" onClick={(e) => e.stopPropagation()} />
      </div>
    </div>
  );
};
