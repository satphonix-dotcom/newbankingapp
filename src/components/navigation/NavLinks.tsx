
import { Link } from "react-router-dom";

interface NavLinksProps {
  isMobile?: boolean;
  onMobileMenuClose?: () => void;
}

export const NavLinks = ({ isMobile, onMobileMenuClose }: NavLinksProps) => {
  const links = [
    { to: "/features", text: "Features" },
    { to: "/pricing", text: "Pricing" },
    { to: "/about", text: "About" },
  ];

  return (
    <>
      {links.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className={`${
            isMobile
              ? "block text-secondary hover:text-primary transition-colors"
              : "text-secondary hover:text-primary transition-colors"
          }`}
          onClick={onMobileMenuClose}
        >
          {link.text}
        </Link>
      ))}
    </>
  );
};
