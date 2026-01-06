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
  Tag,
  Bell
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Session } from "@supabase/supabase-js";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  const [notifications, setNotifications] = useState<any[]>([]);

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

    // Real-time notifications
    const channel = supabase
      .channel('admin-updates')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'reservations' },
        (payload) => {
          console.log('New Reservation!', payload);
          const newNotif = {
            id: Date.now(),
            title: 'New Reservation',
            message: `From ${payload.new.guest_name} for ${payload.new.party_size} people`,
            type: 'reservation',
            time: new Date().toLocaleTimeString()
          };
          setNotifications(prev => [newNotif, ...prev]);
          toast({
            title: "New Reservation!",
            description: `${payload.new.guest_name} just booked a table.`,
          });
          // Play sound (optional)
          const audio = new Audio('/notification.mp3');
          audio.play().catch(() => { });
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        (payload) => {
          console.log('New Order!', payload);
          const newNotif = {
            id: Date.now(),
            title: 'New Order',
            message: `Order #${payload.new.id.slice(0, 8)} from ${payload.new.customer_name}`,
            type: 'order',
            time: new Date().toLocaleTimeString()
          };
          setNotifications(prev => [newNotif, ...prev]);
          toast({
            title: "New Order Received!",
            description: `A new order has been placed by ${payload.new.customer_name}.`,
          });
          const audio = new Audio('/notification.mp3');
          audio.play().catch(() => { });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
      supabase.removeChannel(channel);
    };
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

  const userRole = session?.user?.user_metadata?.role || 'admin';
  const isAdmin = userRole === 'admin';

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card p-8 rounded-xl shadow-lg text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
          <p className="text-muted-foreground">
            You are logged in as <span className="font-semibold">{session.user.email}</span>,
            but you do not have administrator permissions.
          </p>
          <div className="flex flex-col gap-2 pt-4">
            <Button onClick={() => navigate("/dashboard")} className="w-full">
              Go to Customer Dashboard
            </Button>
            <Button variant="outline" onClick={handleLogout} className="w-full text-destructive">
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    );
  }


  const filteredNavItems = navItems.filter(item => {
    if (item.path === "/admin/users" || item.path === "/admin/settings") {
      return isAdmin;
    }
    return true;
  });

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
              {filteredNavItems.map((item) => (
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
                  <p className="text-xs text-secondary-foreground/60 capitalize">{userRole}</p>
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
          <header className="bg-card border-b border-border p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </Button>
              <span className="font-display font-semibold text-foreground">
                {navItems.find(item => item.path === location.pathname)?.label || "Admin Dashboard"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full border border-border">
                    <Bell className="h-5 w-5" />
                    {notifications.length > 0 && (
                      <span className="absolute top-0 right-0 h-4 w-4 bg-primary text-[10px] font-bold text-white rounded-full flex items-center justify-center animate-pulse">
                        {notifications.length}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0 mr-4" align="end">
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <h4 className="font-bold text-sm">Notifications</h4>
                    {notifications.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 text-xs text-primary hover:bg-transparent"
                        onClick={() => setNotifications([])}
                      >
                        Clear All
                      </Button>
                    )}
                  </div>
                  <ScrollArea className="h-[300px]">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-muted-foreground text-sm">
                        No new notifications
                      </div>
                    ) : (
                      <div className="divide-y divide-border">
                        {notifications.map(n => (
                          <div key={n.id} className="p-4 hover:bg-muted/50 transition-colors cursor-pointer group">
                            <div className="flex justify-between items-start mb-1">
                              <Badge variant="outline" className={cn(
                                "text-[10px] px-1.5 py-0 h-4",
                                n.type === 'reservation' ? "bg-blue-500/10 text-blue-600 border-blue-200" : "bg-green-500/10 text-green-600 border-green-200"
                              )}>
                                {n.type}
                              </Badge>
                              <span className="text-[10px] text-muted-foreground">{n.time}</span>
                            </div>
                            <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{n.title}</p>
                            <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </PopoverContent>
              </Popover>
            </div>
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
              {isAdmin && <Route path="users" element={<AdminUsers />} />}
              {isAdmin && <Route path="settings" element={<AdminSettings />} />}
              <Route path="deals" element={<AdminDeals />} />
            </Routes>
          </main>
        </div>
      </div>
    </>
  );
};

export default Admin;
