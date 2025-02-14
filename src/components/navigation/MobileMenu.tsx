
import { NavLinks } from "./NavLinks";
import { AuthButtons } from "./AuthButtons";
import { Session } from "@supabase/supabase-js";

interface MobileMenuProps {
  isOpen: boolean;
  session: Session | null;
  isAdmin: boolean;
  onSignOut: () => Promise<void>;
  onClose: () => void;
}

export const MobileMenu = ({ 
  isOpen, 
  session, 
  isAdmin, 
  onSignOut,
  onClose 
}: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-16 left-0 right-0 bg-background border-b border-border md:hidden">
      <div className="px-6 py-4 space-y-4">
        <NavLinks isMobile onMobileMenuClose={onClose} />
        <AuthButtons 
          session={session} 
          isAdmin={isAdmin} 
          onSignOut={onSignOut} 
          isMobile 
          onMobileMenuClose={onClose}
        />
      </div>
    </div>
  );
};
