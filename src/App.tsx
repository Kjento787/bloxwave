import { useState, useCallback } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { SplashScreen } from "@/components/SplashScreen";
import Landing from "./pages/Landing";
import ProfileSelect from "./pages/ProfileSelect";
import Index from "./pages/Index";
import Movies from "./pages/Movies";
import Genres from "./pages/Genres";
import GenreDetail from "./pages/GenreDetail";
import Search from "./pages/Search";
import MovieDetail from "./pages/MovieDetail";
import TVDetail from "./pages/TVDetail";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import Banned from "./pages/Banned";
import NotFound from "./pages/NotFound";
import BanCheckWrapper from "./components/BanCheckWrapper";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookiePolicy from "./pages/CookiePolicy";
import DMCA from "./pages/DMCA";
import Hubs from "./pages/Hubs";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 2,
    },
  },
});

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Landing / Auth gate */}
        <Route path="/" element={<Landing />} />
        <Route path="/profiles" element={<ProfileSelect />} />
        
        {/* Main app routes */}
        <Route path="/home" element={<Index />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/genres" element={<Genres />} />
        <Route path="/hubs" element={<Hubs />} />
        <Route path="/genre/:id" element={<GenreDetail />} />
        <Route path="/search" element={<Search />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/tv/:id" element={<TVDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/banned" element={<Banned />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/cookies" element={<CookiePolicy />} />
        <Route path="/dmca" element={<DMCA />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  const [showSplash, setShowSplash] = useState(() => {
    const seen = sessionStorage.getItem("bloxwave-splash-seen");
    return !seen;
  });

  const handleSplashComplete = useCallback(() => {
    sessionStorage.setItem("bloxwave-splash-seen", "true");
    setShowSplash(false);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
        <HashRouter>
          <BanCheckWrapper>
            <AnimatedRoutes />
          </BanCheckWrapper>
        </HashRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
