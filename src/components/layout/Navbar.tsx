import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, Moon, Sun, User, LogOut, LayoutDashboard, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { CartSheet } from "@/components/cart/CartSheet";
import { CartButton } from "@/components/cart/CartButton";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tag, Utensils, Sparkles } from "lucide-react";

const navItems = [
  { name: "Deals 🔥", path: "/deals", special: true },
  { name: "Home", path: "/" },
  { name: "Menu", path: "/menu" },
  { name: "Reservations", path: "/reservations" },
  { name: "Gallery", path: "/gallery" },
  { name: "Blog", path: "/blog" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
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
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

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
              <img src="images/logo.jpg" alt="Ibn Adam Logo" className="w-full h-full object-cover" />
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

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full border-primary/20 border-2 w-10 h-10 overflow-hidden">
                    <User className="w-5 h-5 text-primary" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-bold leading-none">{user.user_metadata?.full_name || 'My Account'}</p>
                      <p className="text-xs leading-none text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link to="/dashboard" className="flex items-center">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="outline" className="border-primary/20 hover:bg-primary/10">
                <Link to="/auth">Sign In</Link>
              </Button>
            )}
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



        {/* Mobile Navigation (Sheet) */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0 border-r border-border/40 bg-background/95 backdrop-blur-xl">
            <div className="flex flex-col h-full safe-top safe-bottom">
              {/* Sheet Header */}
              <div className="p-6 border-b border-border/40">
                <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-primary/20 shadow-glow">
                    <img src="images/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-bold bg-gradient-to-r from-primary to-spice bg-clip-text text-transparent">Pak Cuisine</h2>
                    <p className="text-xs text-muted-foreground font-medium tracking-wider">PREMIUM TASTE</p>
                  </div>
                </Link>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                {navItems.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200",
                      location.pathname === link.path
                        ? "bg-primary/10 text-primary translate-x-2"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                      link.special && "bg-gradient-to-r from-orange-500/10 to-transparent text-orange-500 font-bold"
                    )}
                  >
                    {link.path === "/deals" && <Sparkles className="w-4 h-4" />}
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* Footer / User Actions */}
              <div className="p-6 mt-auto border-t border-border/40 space-y-4 bg-muted/20">
                {user ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border/50 shadow-sm">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                        <User className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">{user.user_metadata?.full_name || 'User'}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button asChild variant="outline" className="w-full justify-start gap-2 h-10">
                        <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                          <LayoutDashboard className="w-4 h-4" /> Dashboard
                        </Link>
                      </Button>
                      <Button onClick={() => { handleLogout(); setIsOpen(false); }} variant="destructive" className="w-full justify-start gap-2 h-10 bg-destructive/10 text-destructive hover:bg-destructive/20 border-transparent">
                        <LogOut className="w-4 h-4" /> Sign Out
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button asChild className="w-full bg-gradient-primary shadow-glow h-12 rounded-xl text-base">
                    <Link to="/auth" onClick={() => setIsOpen(false)}>Sign In / Register</Link>
                  </Button>
                )}

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="w-full justify-center gap-2 h-9"
                  >
                    {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    <span className="text-xs font-bold">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                  </Button>
                  <a
                    href="tel:+1234567890"
                    className="flex items-center justify-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors h-9 border border-border/50 rounded-md"
                  >
                    <Phone className="w-3 h-3" /> Support
                  </a>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <CartSheet />
    </header>
  );
}
