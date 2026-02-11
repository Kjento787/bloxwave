import { useState, useRef, useEffect, useCallback } from "react";
import { 
  X, Maximize, Minimize, ShieldCheck, Server, Captions, 
  SkipForward, SkipBack, ChevronDown, Check,
  Tv, Monitor, Smartphone, Keyboard, AlertTriangle
} from "lucide-react";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { KeyboardShortcutsOverlay } from "@/components/player/KeyboardShortcutsOverlay";
import { ShareButton } from "@/components/player/ShareButton";
import { useWatchHistory } from "@/hooks/useWatchHistory";
import { useAdBlocker } from "@/hooks/useAdBlocker";
import { useServerHealth } from "@/hooks/useServerHealth";

interface VideoPlayerProps {
  contentId: number;
  contentType: "movie" | "tv";
  title: string;
  subtitle?: string;
  season?: number;
  episode?: number;
  totalEpisodes?: number;
  totalSeasons?: number;
  onClose: () => void;
  onNextEpisode?: () => void;
  onPreviousEpisode?: () => void;
  onEpisodeSelect?: (episode: number) => void;
  onSeasonSelect?: (season: number) => void;
}

export const VideoPlayerRevamped = ({ 
  contentId, 
  contentType, 
  title, 
  subtitle, 
  season,
  episode,
  totalEpisodes,
  totalSeasons,
  onClose,
  onNextEpisode,
  onPreviousEpisode,
  onEpisodeSelect,
  onSeasonSelect
}: VideoPlayerProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedServer, setSelectedServer] = useState("vidsrcxyz");
  const [popupBlocked, setPopupBlocked] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [serverPanelOpen, setServerPanelOpen] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);
  const hideControlsTimer = useRef<NodeJS.Timeout | null>(null);
  const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { addToHistory } = useWatchHistory();
  const { enabled: adBlockerEnabled } = useAdBlocker();
  const { reportFailure, reportSuccess, getAliveServers, isServerDead } = useServerHealth();

  const aliveServers = getAliveServers(EMBED_SERVERS);
  const currentServer = aliveServers.find(s => s.id === selectedServer) || aliveServers[0];
  const embedUrl = getEmbedUrl(contentId, contentType, season, episode, currentServer.id);

  // If selected server became dead, auto-switch to first alive server
  useEffect(() => {
    if (isServerDead(selectedServer) && aliveServers.length > 0) {
      const next = aliveServers[0];
      setSelectedServer(next.id);
      setIsLoading(true);
    }
  }, [selectedServer, isServerDead, aliveServers]);

  const handleServerChange = (serverId: string) => {
    setIsLoading(true);
    setSelectedServer(serverId);
    setPopupBlocked(0);
    setServerPanelOpen(false);
  };

  // Timeout-based failure detection: if iframe doesn't load within 15s, mark server as failed
  useEffect(() => {
    if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
    loadTimeoutRef.current = setTimeout(() => {
      if (isLoading) {
        reportFailure(currentServer.id);
        // Auto-switch to next alive server
        const remaining = aliveServers.filter(s => s.id !== currentServer.id);
        if (remaining.length > 0) {
          setSelectedServer(remaining[0].id);
          setIsLoading(true);
        }
      }
    }, 15000);
    return () => {
      if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
    };
  }, [currentServer.id, isLoading, aliveServers]);

  // Auto-hide controls
  const resetHideTimer = useCallback(() => {
    setControlsVisible(true);
    if (hideControlsTimer.current) {
      clearTimeout(hideControlsTimer.current);
    }
    hideControlsTimer.current = setTimeout(() => {
      if (!serverPanelOpen) {
        setControlsVisible(false);
      }
    }, 3000);
  }, [serverPanelOpen]);

  useEffect(() => {
    resetHideTimer();
    return () => {
      if (hideControlsTimer.current) {
        clearTimeout(hideControlsTimer.current);
      }
    };
  }, [resetHideTimer]);

  const toggleFullscreen = async () => {
    if (!playerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        if (playerRef.current.requestFullscreen) {
          await playerRef.current.requestFullscreen();
        } else if ((playerRef.current as any).webkitRequestFullscreen) {
          await (playerRef.current as any).webkitRequestFullscreen();
        }
        setIsFullscreen(true);
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  };

  // Block popups (only if ad blocker enabled)
  useEffect(() => {
    if (!adBlockerEnabled) return;
    const originalOpen = window.open;
    window.open = function(...args) {
      setPopupBlocked(prev => prev + 1);
      return null;
    };
    return () => { window.open = originalOpen; };
  }, [adBlockerEnabled]);

  // Track watch history
  useEffect(() => {
    addToHistory({
      contentId,
      contentType,
      title,
      posterPath: null,
      season,
      episode,
      server: selectedServer,
    });
  }, [contentId, contentType, season, episode, selectedServer]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      resetHideTimer();
      if (e.key === "Escape" && !document.fullscreenElement) onClose();
      if (e.key === "f" || e.key === "F") toggleFullscreen();
      if (e.key === "?") setShowShortcuts(prev => !prev);
      if (contentType === "tv") {
        if (e.key === "ArrowRight" && e.shiftKey && onNextEpisode) onNextEpisode();
        if (e.key === "ArrowLeft" && e.shiftKey && onPreviousEpisode) onPreviousEpisode();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onNextEpisode, onPreviousEpisode, contentType, resetHideTimer]);

  useEffect(() => {
    if (adBlockerEnabled) {
      document.body.classList.add('ad-blocker-active');
      return () => document.body.classList.remove('ad-blocker-active');
    }
  }, [adBlockerEnabled]);

  const canGoPrevious = contentType === "tv" && episode !== undefined && (episode > 1 || (season !== undefined && season > 1));
  const canGoNext = contentType === "tv" && episode !== undefined && totalEpisodes !== undefined && 
    (episode < totalEpisodes || (totalSeasons !== undefined && season !== undefined && season < totalSeasons));

  return (
    <div 
      ref={playerRef} 
      className="fixed inset-0 z-50 bg-black flex flex-col"
      onMouseMove={resetHideTimer}
      onTouchStart={resetHideTimer}
    >
      {/* Top Header */}
      <div className={cn(
        "absolute top-0 left-0 right-0 z-30 transition-all duration-300",
        controlsVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
      )}>
        <div className="flex items-center justify-between p-3 md:p-4 lg:p-6 bg-gradient-to-b from-black/95 via-black/70 to-transparent">
          {/* Left - Title & Protection */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose} 
              className="h-10 w-10 md:h-12 md:w-12 text-white/90 hover:text-white hover:bg-white/10 flex-shrink-0"
            >
              <X className="h-6 w-6" />
            </Button>
            <div className="min-w-0">
              <h2 className="text-base md:text-lg lg:text-xl font-bold text-white truncate">{title}</h2>
              {subtitle && (
                <p className="text-sm text-white/60 truncate">{subtitle}</p>
              )}
            </div>
            {adBlockerEnabled && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium flex-shrink-0">
                <ShieldCheck className="h-4 w-4" />
                <span>Protected</span>
                {popupBlocked > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 bg-emerald-500/30 rounded-full text-[10px] font-bold">
                    {popupBlocked}
                  </span>
                )}
              </div>
            )}
          </div>
          
          {/* Right - Controls */}
          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            {/* Server Button - Opens Sheet on Mobile, Dropdown on Desktop */}
            <Sheet open={serverPanelOpen} onOpenChange={setServerPanelOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  className="h-10 md:h-11 px-3 md:px-4 gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
                >
                  <Server className="h-4 w-4" />
                  <span className="hidden sm:inline text-sm">{currentServer.name}</span>
                  <span className="sm:hidden text-sm">Server</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[70vh] md:h-[60vh] rounded-t-3xl bg-background/95 backdrop-blur-xl border-t-2 border-primary/20">
                <SheetHeader className="pb-4 border-b border-border">
                  <SheetTitle className="text-xl font-bold flex items-center gap-2">
                    <Server className="h-5 w-5 text-primary" />
                    Select Server
                  </SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-[calc(100%-80px)] mt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pr-4">
                    {EMBED_SERVERS.map((server) => {
                      const dead = isServerDead(server.id);
                      return (
                        <button
                          key={server.id}
                          onClick={() => !dead && handleServerChange(server.id)}
                          disabled={dead}
                          className={cn(
                            "relative p-4 rounded-xl border-2 transition-all duration-200 text-left",
                            dead
                              ? "border-destructive/30 bg-destructive/5 opacity-50 cursor-not-allowed"
                              : "hover:scale-[1.02] hover:shadow-lg",
                            !dead && selectedServer === server.id
                              ? "border-primary bg-primary/10 shadow-md shadow-primary/20"
                              : !dead && "border-border bg-card hover:border-primary/50"
                          )}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-lg">{server.name}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                {dead ? (
                                  <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-destructive/20 text-destructive">
                                    <AlertTriangle className="h-3 w-3" />
                                    Unavailable
                                  </span>
                                ) : server.hasSubtitles && (
                                  <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                                    <Captions className="h-3 w-3" />
                                    Subtitles
                                  </span>
                                )}
                              </div>
                            </div>
                            {!dead && selectedServer === server.id && (
                              <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                                <Check className="h-4 w-4 text-primary-foreground" />
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-3 mt-3 text-muted-foreground">
                            <Smartphone className="h-4 w-4" aria-label="Mobile" />
                            <Monitor className="h-4 w-4" aria-label="Desktop" />
                            <Tv className="h-4 w-4" aria-label="TV" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>

            {/* Share */}
            <ShareButton
              contentId={contentId}
              contentType={contentType}
              title={title}
              season={season}
              episode={episode}
            />

            {/* Keyboard Shortcuts */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowShortcuts(true)}
              className="hidden md:flex h-10 w-10 md:h-11 md:w-11 text-white/80 hover:text-white hover:bg-white/10"
              title="Keyboard shortcuts (?)"
            >
              <Keyboard className="h-5 w-5" />
            </Button>

            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleFullscreen} 
              className="h-10 w-10 md:h-11 md:w-11 text-white/80 hover:text-white hover:bg-white/10"
            >
              {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Video Container */}
      <div className="flex-1 w-full relative overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-14 w-14 border-4 border-primary/30 border-t-primary" />
              <p className="text-white/60 text-sm">Loading {currentServer.name}...</p>
            </div>
          </div>
        )}

        <iframe
          key={`${selectedServer}-${season}-${episode}`}
          src={embedUrl}
          className={cn(
            "w-full h-full transition-opacity duration-500",
            isLoading ? "opacity-0" : "opacity-100"
          )}
          allowFullScreen={true}
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          referrerPolicy="no-referrer"
          onLoad={() => { setIsLoading(false); reportSuccess(currentServer.id); }}
          sandbox="allow-scripts allow-same-origin allow-forms allow-presentation allow-popups"
          style={{ border: 'none' }}
        />
      </div>

      {/* Bottom Controls - TV Shows */}
      {contentType === "tv" && (
        <div className={cn(
          "absolute bottom-0 left-0 right-0 z-30 transition-all duration-300",
          controlsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full pointer-events-none"
        )}>
          <div className="bg-gradient-to-t from-black/95 via-black/80 to-transparent pt-12 pb-6 px-4 md:px-6 lg:px-8">
            {/* Episode Navigation */}
            <div className="flex items-center justify-between gap-4 max-w-4xl mx-auto">
              {/* Previous */}
              <Button 
                variant="ghost" 
                size="lg"
                onClick={onPreviousEpisode}
                disabled={!canGoPrevious}
                className={cn(
                  "h-14 px-4 md:px-6 gap-2 text-white rounded-xl",
                  canGoPrevious 
                    ? "hover:bg-white/10" 
                    : "opacity-30 cursor-not-allowed"
                )}
              >
                <SkipBack className="h-5 w-5" />
                <span className="hidden md:inline">Previous</span>
              </Button>

              {/* Center - Episode Select */}
              <div className="flex-1 flex flex-col items-center gap-3">
                <div className="flex items-center gap-3">
                  {totalSeasons && totalSeasons > 1 && onSeasonSelect && (
                    <Select value={String(season)} onValueChange={(v) => onSeasonSelect(Number(v))}>
                      <SelectTrigger className="w-32 h-11 bg-white/10 border-white/20 text-white text-sm rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {Array.from({ length: totalSeasons }, (_, i) => i + 1).map((s) => (
                          <SelectItem key={s} value={String(s)}>Season {s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  
                  {totalEpisodes && onEpisodeSelect && (
                    <Select value={String(episode)} onValueChange={(v) => onEpisodeSelect(Number(v))}>
                      <SelectTrigger className="w-36 h-11 bg-white/10 border-white/20 text-white text-sm rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-64 rounded-xl">
                        {Array.from({ length: totalEpisodes }, (_, i) => i + 1).map((ep) => (
                          <SelectItem key={ep} value={String(ep)}>Episode {ep}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                
                {/* Episode Progress Dots */}
                {totalEpisodes && episode && totalEpisodes <= 20 && (
                  <div className="flex gap-1.5">
                    {Array.from({ length: totalEpisodes }, (_, i) => i + 1).map((ep) => (
                      <button
                        key={ep}
                        onClick={() => onEpisodeSelect?.(ep)}
                        className={cn(
                          "w-2.5 h-2.5 rounded-full transition-all duration-200",
                          ep === episode 
                            ? "bg-primary scale-125" 
                            : ep < episode 
                              ? "bg-primary/50 hover:bg-primary/70" 
                              : "bg-white/30 hover:bg-white/50"
                        )}
                        title={`Episode ${ep}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Next */}
              <Button 
                variant="default"
                size="lg"
                onClick={onNextEpisode}
                disabled={!canGoNext}
                className={cn(
                  "h-14 px-6 md:px-8 gap-2 rounded-xl",
                  canGoNext 
                    ? "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30" 
                    : "opacity-30 cursor-not-allowed"
                )}
              >
                <span className="hidden md:inline">Next Episode</span>
                <span className="md:hidden">Next</span>
                <SkipForward className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Overlay */}
      <KeyboardShortcutsOverlay visible={showShortcuts} onClose={() => setShowShortcuts(false)} />
    </div>
  );
};
