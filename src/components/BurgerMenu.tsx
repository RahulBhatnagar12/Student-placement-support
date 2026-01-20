import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Home, Info, BarChart3, FileText } from "lucide-react";

const ABOUT_US_URL = "https://hbtu.ac.in"; // Configurable external URL

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  external?: boolean;
}

const navItems: NavItem[] = [
  { label: "Home", path: "/", icon: Home },
  { label: "About Us", path: ABOUT_US_URL, icon: Info, external: true },
  { label: "Placement Insights", path: "/placement-insights", icon: BarChart3 },
  { label: "Interview Experience", path: "/interview-experience", icon: FileText },
];

const BurgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Menu Button */}
      <button
        onClick={toggleMenu}
        className="fixed top-4 left-4 z-50 p-3 bg-primary text-primary-foreground rounded-lg shadow-lg hover:bg-navy-light transition-all duration-200"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-navy-dark/50 backdrop-blur-sm z-40"
          onClick={closeMenu}
        />
      )}

      {/* Side Menu */}
      <nav
        className={`fixed top-0 left-0 h-full w-72 bg-card shadow-2xl z-40 transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-6 gradient-hero">
          <h2 className="text-xl font-display font-bold text-primary-foreground">
            HBTU Placement
          </h2>
          <p className="text-sm text-primary-foreground/80 font-body mt-1">
            Insights Portal
          </p>
        </div>

        {/* Navigation Links */}
        <ul className="py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = !item.external && location.pathname === item.path;

            if (item.external) {
              return (
                <li key={item.label}>
                  <a
                    href={item.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={closeMenu}
                    className="flex items-center gap-4 px-6 py-4 text-foreground hover:bg-secondary transition-colors duration-200 font-body"
                  >
                    <Icon className="w-5 h-5 text-accent" />
                    <span className="font-medium">{item.label}</span>
                  </a>
                </li>
              );
            }

            return (
              <li key={item.label}>
                <Link
                  to={item.path}
                  onClick={closeMenu}
                  className={`flex items-center gap-4 px-6 py-4 transition-colors duration-200 font-body ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-secondary"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-gold" : "text-accent"}`} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-border">
          <p className="text-xs text-muted-foreground font-body text-center">
            © {new Date().getFullYear()} HBTU Kanpur
          </p>
        </div>
      </nav>
    </>
  );
};

export default BurgerMenu;
