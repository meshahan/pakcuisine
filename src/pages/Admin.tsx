import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Calendar,
  MessageSquare,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Users,
  Image,
  Shield,
  Tag
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Session } from "@supabase/supabase-js";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminMenu } from "@/components/admin/AdminMenu";
import { AdminReservations } from "@/components/admin/AdminReservations";
import { AdminContacts } from "@/components/admin/AdminContacts";
import { AdminBlog } from "@/components/admin/AdminBlog";
import { AdminGallery } from "@/components/admin/AdminGallery";
import { AdminTestimonials } from "@/components/admin/AdminTestimonials";
import { AdminUsers } from "@/components/admin/AdminUsers";
import { AdminSettings } from "@/components/admin/AdminSettings";
import AdminOrders from "@/components/admin/AdminOrders";
import AdminDeals from "@/components/admin/AdminDeals";

const navItems = [
  { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/admin/orders", icon: UtensilsCrossed, label: "Orders" },
  { path: "/admin/menu", icon: UtensilsCrossed, label: "Menu" },
  { path: "/admin/reservations", icon: Calendar, label: "Reservations" },
  { path: "/admin/contacts", icon: MessageSquare, label: "Messages" },
  { path: "/admin/blog", icon: FileText, label: "Blog" },
  { path: "/admin/gallery", icon: Image, label: "Gallery" },
  { path: "/admin/testimonials", icon: Users, label: "Testimonials" },
  { path: "/admin/users", icon: Shield, label: "Users" },
  { path: "/admin/deals", icon: Tag, label: "Deals" },
  { path: "/admin/settings", icon: Settings, label: "Settings" },
];

const Admin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setIsLoading(false);

      if (!session) {
        navigate("/auth");
      }
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);

      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Logged out successfully" });
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Pak Cuisine</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-muted flex">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-foreground/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-secondary text-secondary-foreground transform transition-transform duration-300 lg:transform-none",
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 border-b border-secondary-foreground/10">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center border border-white/20 bg-white">
                  <img src="/images/logo.jpg" alt="Ibn Adam Logo" className="w-full h-full object-cover" />
                </div>
                <span className="font-display text-xl font-bold text-primary-foreground">
                  Pak Cuisine
                </span>
              </Link>
              <p className="text-xs text-secondary-foreground/60 mt-1">Admin Dashboard</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    location.pathname === item.path
                      ? "bg-primary text-primary-foreground"
                      : "text-secondary-foreground/80 hover:bg-secondary-foreground/10"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* User */}
            <div className="p-4 border-t border-secondary-foreground/10">
              <div className="flex items-center gap-3 mb-4 px-2">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-primary-foreground truncate">
                    {session.user.email}
                  </p>
                  <p className="text-xs text-secondary-foreground/60">Administrator</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-secondary-foreground/20 text-secondary-foreground hover:bg-secondary-foreground/10"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar */}
          <header className="bg-card border-b border-border p-4 flex items-center gap-4 lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </Button>
            <span className="font-display font-semibold text-foreground">Admin Dashboard</span>
          </header>

          {/* Content */}
          <main className="flex-1 p-6 overflow-auto">
            <Routes>
              <Route index element={<AdminDashboard />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="menu" element={<AdminMenu />} />
              <Route path="reservations" element={<AdminReservations />} />
              <Route path="contacts" element={<AdminContacts />} />
              <Route path="blog" element={<AdminBlog />} />
              <Route path="gallery" element={<AdminGallery />} />
              <Route path="testimonials" element={<AdminTestimonials />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="deals" element={<AdminDeals />} />
            </Routes>
          </main>
        </div>
      </div>
    </>
  );
};

export default Admin;
