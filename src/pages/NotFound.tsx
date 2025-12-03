import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, Search } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
        <h1 className="text-8xl md:text-9xl font-bold text-gradient mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/">
            <Button variant="hero" size="lg">
              <Home className="h-5 w-5" />
              Go Home
            </Button>
          </Link>
          <Link to="/search">
            <Button variant="glass" size="lg">
              <Search className="h-5 w-5" />
              Search Movies
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
