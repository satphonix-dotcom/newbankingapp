
import { Link } from "react-router-dom";
import { type SiteSettings } from "@/hooks/useSiteSettings";

interface LogoProps {
  settings?: SiteSettings;
}

export const Logo = ({ settings }: LogoProps) => {
  return (
    <Link to="/" className="flex items-center gap-2">
      {settings?.logoUrl ? (
        <img 
          src={settings.logoUrl} 
          alt={settings?.bankName || "BankApp"} 
          className="h-8 w-auto"
        />
      ) : (
        <span className="text-xl font-semibold">
          {settings?.bankName || "BankApp"}
        </span>
      )}
    </Link>
  );
};
