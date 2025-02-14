
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useToast } from "./ui/use-toast";

const Navigation = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Effect to scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [navigate]);

  const checkAdminRole = async (userId: string) => {
    try {
      const { data: roleData, error } = await supabase
        .rpc('has_role', {
          user_id: userId,
          required_role: 'admin'
        });

      if (error) {
        console.error('Error checking admin role:', error);
        return false;
      }

      return !!roleData;
    } catch (error) {
      console.error('Error in admin role check:', error);
      return false;
    }
  };

  // Effect to handle auth state and check admin role
  useEffect(() => {
    const handleSession = async (session: Session | null) => {
      setSession(session);
      if (session?.user?.id) {
        const isUserAdmin = await checkAdminRole(session.user.id);
        console.log('Admin role check result:', isUserAdmin);
        setIsAdmin(isUserAdmin);
      } else {
        setIsAdmin(false);
      }
      setIsLoading(false);
    };

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/");
      toast({
        title: "Signed out successfully",
      });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "Please try again",
      });
    }
  };

  if (isLoading) {
    return null; // Or a loading spinner
  }

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
                <Button variant="ghost">
                  Dashboard
                </Button>
              </Link>
              {isAdmin && (
                <Link to="/admin-dashboard">
                  <Button variant="ghost">
                    Admin Dashboard
                  </Button>
                </Link>
              )}
              <Button onClick={handleSignOut}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link to="/sign-in">
                <Button variant="ghost">
                  Sign In
                </Button>
              </Link>
              <Link to="/get-started">
                <Button>
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
