import { useState, useRef, useEffect } from "react";
import { X, Maximize, Minimize, ShieldCheck, Server, ChevronDown, Captions } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EMBED_SERVERS, getEmbedUrl } from "@/lib/tmdb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VideoPlayerProps {
  contentId: number;
  contentType: "movie" | "tv";
  title: string;
  subtitle?: string;
  season?: number;
  episode?: number;
  onClose: () => void;
}

export const VideoPlayer = ({ 
  contentId, 
  contentType, 
  title, 
  subtitle, 
  season, 
  episode,
  onClose 
}: VideoPlayerProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedServer, setSelectedServer] = useState("vidsrcxyz");
  const playerRef = useRef<HTMLDivElement>(null);

  const currentServer = EMBED_SERVERS.find(s => s.id === selectedServer) || EMBED_SERVERS[0];
  const embedUrl = getEmbedUrl(contentId, contentType, season, episode, selectedServer);

  const handleServerChange = (serverId: string) => {
    setIsLoading(true);
    setSelectedServer(serverId);
  };

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
          {/* Server Selector */}
          <div className="flex items-center gap-2">
            <Server className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedServer} onValueChange={handleServerChange}>
              <SelectTrigger className="w-[180px] h-9 bg-background/50 border-border/50">
                <SelectValue placeholder="Select server" />
              </SelectTrigger>
              <SelectContent>
                {EMBED_SERVERS.map((server) => (
                  <SelectItem key={server.id} value={server.id}>
                    <div className="flex items-center gap-2">
                      <span>{server.name}</span>
                      {server.hasSubtitles && (
                        <Captions className="h-3.5 w-3.5 text-primary" />
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button variant="glass" size="icon" onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
          </Button>
          <Button variant="glass" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Subtitle indicator */}
      <div className="px-4 py-2 bg-background/60 border-b border-border/30 flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Current:</span>
        <span className="font-medium">{currentServer.name}</span>
        {currentServer.hasSubtitles ? (
          <span className="flex items-center gap-1 text-primary text-xs">
            <Captions className="h-3.5 w-3.5" />
            Subtitles available
          </span>
        ) : (
          <span className="text-muted-foreground text-xs">No subtitles</span>
        )}
        <span className="text-muted-foreground ml-auto text-xs">
          Try another server if this one doesn't work
        </span>
      </div>

      {/* Video Container with Ad Blocking */}
      <div className="flex-1 w-full relative overflow-hidden video-player-container">
        {/* Loading state */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
              <p className="text-muted-foreground">Loading {currentServer.name}...</p>
            </div>
          </div>
        )}

        {/* Iframe with permissions for all content types */}
        <iframe
          key={selectedServer}
          src={embedUrl}
          className={cn(
            "w-full h-full transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100"
          )}
          allowFullScreen
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media; clipboard-write"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={() => setIsLoading(false)}
          style={{ 
            border: 'none',
            display: 'block'
          }}
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
