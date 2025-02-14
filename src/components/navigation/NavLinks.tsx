
import { Link } from "react-router-dom";

interface NavLinksProps {
  isMobile?: boolean;
  onMobileMenuClose?: () => void;
}

export const NavLinks = ({ isMobile, onMobileMenuClose }: NavLinksProps) => {
  const links = [
    { to: "/features", text: "Features" },
    { to: "/pricing", text: "Pricing" },
    { to: "/security", text: "Security" },
    { to: "/status", text: "Status" },
    { to: "/about", text: "About" },
    { to: "/blog", text: "Blog" },
    { to: "/careers", text: "Careers" },
    { to: "/press", text: "Press" },
    { to: "/documentation", text: "Documentation" },
    { to: "/help-center", text: "Help Center" },
    { to: "/contact", text: "Contact" },
    { to: "/privacy", text: "Privacy" },
    { to: "/terms", text: "Terms" },
    { to: "/cookies", text: "Cookies" },
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
