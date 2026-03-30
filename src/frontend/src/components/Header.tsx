import { Button } from "@/components/ui/button";
import { Coins, Menu, X } from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

type Section =
  | "home"
  | "tasks"
  | "wallet"
  | "refer"
  | "leaderboard"
  | "profile"
  | "admin";

interface HeaderProps {
  activeSection: Section;
  onNavigate: (section: Section) => void;
  isAdmin: boolean;
}

const navLinks: { label: string; section: Section }[] = [
  { label: "Daily Tasks", section: "tasks" },
  { label: "Refer & Earn", section: "refer" },
  { label: "Wallet", section: "wallet" },
  { label: "Profile", section: "profile" },
];

export function Header({ activeSection, onNavigate, isAdmin }: HeaderProps) {
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const [menuOpen, setMenuOpen] = useState(false);
  const isLoggedIn = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const handleNav = (section: Section) => {
    onNavigate(section);
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-xs">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Brand */}
        <button
          type="button"
          onClick={() => handleNav("home")}
          className="flex items-center gap-2 font-bold text-lg"
          data-ocid="header.link"
        >
          <span className="w-8 h-8 rounded-full gradient-hero flex items-center justify-center">
            <Coins className="w-4 h-4 text-white" />
          </span>
          <span className="text-foreground">EarnMax</span>
          <span className="text-[10px] font-semibold bg-brand-teal text-white px-1.5 py-0.5 rounded-full ml-0.5">
            RBI
          </span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              type="button"
              key={link.section}
              onClick={() => handleNav(link.section)}
              data-ocid={`header.${link.section}.link`}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeSection === link.section
                  ? "text-primary bg-accent"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {link.label}
            </button>
          ))}
          {isAdmin && (
            <button
              type="button"
              onClick={() => handleNav("admin")}
              data-ocid="header.admin.link"
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeSection === "admin"
                  ? "text-primary bg-accent"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              Admin
            </button>
          )}
        </nav>

        {/* Auth Button */}
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <Button
              size="sm"
              onClick={() => clear()}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
              data-ocid="header.logout.button"
            >
              Logout
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => login()}
              disabled={isLoggingIn}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-5"
              data-ocid="header.login.button"
            >
              {isLoggingIn ? "Logging in..." : "LOG IN"}
            </Button>
          )}
          <button
            type="button"
            className="md:hidden p-1"
            onClick={() => setMenuOpen(!menuOpen)}
            data-ocid="header.menu.toggle"
          >
            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-border px-4 py-3 flex flex-col gap-1">
          {navLinks.map((link) => (
            <button
              type="button"
              key={link.section}
              onClick={() => handleNav(link.section)}
              data-ocid={`header.mobile.${link.section}.link`}
              className={`text-left px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeSection === link.section
                  ? "text-primary bg-accent"
                  : "text-muted-foreground"
              }`}
            >
              {link.label}
            </button>
          ))}
          {isAdmin && (
            <button
              type="button"
              onClick={() => handleNav("admin")}
              data-ocid="header.mobile.admin.link"
              className="text-left px-3 py-2 text-sm font-medium rounded-md text-muted-foreground"
            >
              Admin Panel
            </button>
          )}
        </div>
      )}
    </header>
  );
}
