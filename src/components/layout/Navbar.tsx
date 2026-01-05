import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { CartSheet } from "@/components/cart/CartSheet";
import { CartButton } from "@/components/cart/CartButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tag, Utensils, Sparkles } from "lucide-react";

const navItems = [
  { name: "Deals 🔥", path: "/deals", special: true },
  { name: "Home", path: "/" },
  { name: "Menu", path: "/menu" },
  { name: "Reservations", path: "/reservations" },
  { name: "Gallery", path: "/gallery" },
  { name: "About", path: "/about" },
  { name: "Blog", path: "/blog" },
  { name: "Contact", path: "/contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled || !isHomePage
          ? "bg-background/95 backdrop-blur-md shadow-md py-2"
          : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center border border-primary/20 bg-white">
              <img src="/images/logo.jpg" alt="Ibn Adam Logo" className="w-full h-full object-cover" />
            </div>
            <span className={cn(
              "font-display text-2xl font-bold transition-colors",
              isScrolled || !isHomePage ? "text-foreground" : "text-white"
            )}>
              Pak Cuisine
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location.pathname === link.path
                    ? "text-primary"
                    : (isScrolled || !isHomePage ? "text-foreground/80" : "text-white/90"),
                  link.special && "text-orange-500 font-bold animate-pulse"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Cart Button */}
            <div className={cn(
              "transform transition-colors",
              isScrolled || !isHomePage ? "text-foreground" : "text-white"
            )}>
              <CartButton />
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={cn(
                "rounded-full border-primary/20 hover:bg-primary/10",
                isScrolled || !isHomePage ? "text-foreground" : "text-white border-white/20 hover:bg-white/10"
              )}
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Button asChild variant="secondary" className="hover:bg-secondary/80 shadow-sm border border-primary/20 gap-2">
              <Link to="/order-selection">
                Order Online
                <Sparkles className="w-4 h-4 text-primary animate-pulse ml-2" />
              </Link>
            </Button>
            <Button asChild className="bg-gradient-primary hover:opacity-90 shadow-glow">
              <Link to="/reservations">Book a Table</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className={cn(
              "transform transition-colors",
              isScrolled || !isHomePage ? "text-foreground" : "text-white"
            )}>
              <CartButton />
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                "p-2 rounded-lg transition-colors",
                isScrolled || !isHomePage
                  ? "text-foreground hover:bg-muted"
                  : "text-white hover:bg-white/10"
              )}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300",
            isOpen ? "max-h-screen opacity-100 mt-4" : "max-h-0 opacity-0"
          )}
        >
          <div className="bg-card rounded-xl p-4 shadow-lg space-y-4">
            <div className="flex items-center justify-between px-4 pb-2 border-b border-border">
              <span className="text-sm font-medium text-muted-foreground">Appearance</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full gap-2"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
                <span className="text-xs uppercase font-bold tracking-wider">
                  {theme === "dark" ? "Light" : "Dark"}
                </span>
              </Button>
            </div>
            <div className="md:hidden pt-2 pb-2 space-y-2">
              {navItems.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-2 text-base font-medium transition-colors hover:bg-muted ${location.pathname === link.path
                    ? "text-primary bg-muted/50"
                    : "text-foreground/80"
                    } ${link.special ? "text-orange-500 font-bold" : ""}`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="pt-4 space-y-3 border-t border-border">
              <a
                href="tel:+1234567890"
                className="flex items-center gap-2 py-3 px-4 text-foreground font-medium"
              >
                <Phone className="w-4 h-4" />
                <span>(123) 456-7890</span>
              </a>
              <div className="grid grid-cols-2 gap-2">
                <Button asChild variant="secondary" className="w-full h-12 shadow-sm border border-primary/20">
                  <Link to="/order-selection">Order Online</Link>
                </Button>
                <Button asChild className="w-full bg-gradient-primary">
                  <Link to="/reservations">Book Table</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CartSheet />
    </header>
  );
}
