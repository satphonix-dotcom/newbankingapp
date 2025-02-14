
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Session } from "@supabase/supabase-js";

interface AuthButtonsProps {
  session: Session | null;
  isAdmin: boolean;
  onSignOut: () => Promise<void>;
  isMobile?: boolean;
  onMobileMenuClose?: () => void;
}

export const AuthButtons = ({ 
  session, 
  isAdmin, 
  onSignOut, 
  isMobile,
  onMobileMenuClose 
}: AuthButtonsProps) => {
  const handleSignOut = async () => {
    await onSignOut();
    onMobileMenuClose?.();
  };

  if (session) {
    return (
      <>
        <Link 
          to="/dashboard" 
          className={isMobile ? "block" : ""}
          onClick={onMobileMenuClose}
        >
          <Button 
            variant="ghost" 
            className={isMobile ? "w-full justify-start" : ""}
          >
            Dashboard
          </Button>
        </Link>
        {isAdmin && (
          <Link 
            to="/admin-dashboard" 
            className={isMobile ? "block" : ""}
            onClick={onMobileMenuClose}
          >
            <Button 
              variant="ghost" 
              className={isMobile ? "w-full justify-start" : ""}
            >
              Admin Dashboard
            </Button>
          </Link>
        )}
        <Button 
          onClick={handleSignOut}
          className={isMobile ? "w-full" : ""}
        >
          Sign Out
        </Button>
      </>
    );
  }

  return (
    <>
      <Link 
        to="/sign-in" 
        className={isMobile ? "block" : ""}
        onClick={onMobileMenuClose}
      >
        <Button 
          variant="ghost" 
          className={isMobile ? "w-full justify-start" : ""}
        >
          Sign In
        </Button>
      </Link>
      <Link 
        to="/sign-in" 
        className={isMobile ? "block" : ""}
        onClick={onMobileMenuClose}
      >
        <Button className={isMobile ? "w-full" : ""}>
          Get Started
        </Button>
      </Link>
    </>
  );
};
