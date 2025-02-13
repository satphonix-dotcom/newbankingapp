
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

const Navigation = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);

  // Effect to scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [navigate]);

  // Effect to handle auth state
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold">
          BankApp
        </Link>
        
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/features" className="text-secondary hover:text-primary transition-colors">
            Features
          </Link>
          <Link to="/pricing" className="text-secondary hover:text-primary transition-colors">
            Pricing
          </Link>
          <Link to="/about" className="text-secondary hover:text-primary transition-colors">
            About
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {session ? (
            <>
              <Link to="/dashboard">
                <Button variant="ghost" className="hidden md:inline-flex">
                  Dashboard
                </Button>
              </Link>
              <Button onClick={handleSignOut} className="text-white">
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link to="/sign-in">
                <Button variant="ghost" className="hidden md:inline-flex">
                  Sign In
                </Button>
              </Link>
              <Link to="/get-started">
                <Button className="text-white">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
