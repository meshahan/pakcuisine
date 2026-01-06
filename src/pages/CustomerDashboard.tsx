import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Package, Utensils, User, LogOut, MapPin, Clock, ChevronRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { motion } from "framer-motion";

const CustomerDashboard = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [user, setUser] = useState<any>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [reservations, setReservations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate("/auth");
                return;
            }
            setUser(user);
            fetchData(user.id);
        };

        checkUser();
    }, [navigate]);

    const fetchData = async (userId: string) => {
        setLoading(true);
        try {
            const [ordersRes, reservationsRes] = await Promise.all([
                supabase.from('orders').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
                supabase.from('reservations').select('*').eq('user_id', userId).order('created_at', { ascending: false })
            ]);

            if (ordersRes.error) throw ordersRes.error;
            if (reservationsRes.error) throw reservationsRes.error;

            setOrders(ordersRes.data || []);
            setReservations(reservationsRes.data || []);
        } catch (error: any) {
            toast({
                title: "Error fetching data",
                description: error.message,
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/auth");
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'delivered':
            case 'confirmed':
            case 'completed': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'preparing':
            case 'pending': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            case 'out_for_delivery': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
            case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
        }
    };

    return (
        <>
            <Helmet>
                <title>My Dashboard - Pak Cuisine</title>
            </Helmet>

            <div className="min-h-screen bg-background flex flex-col">
                <Navbar />

                <main className="flex-1 pt-24 pb-20">
                    <div className="container mx-auto px-4 max-w-6xl">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                            <div>
                                <h1 className="text-4xl font-display font-bold mb-2">My Account</h1>
                                <p className="text-muted-foreground flex items-center gap-2">
                                    Welcome back, <span className="text-foreground font-semibold">{user?.user_metadata?.full_name || user?.email}</span>
                                </p>
                            </div>
                            <Button variant="outline" onClick={handleLogout} className="flex gap-2">
                                <LogOut className="w-4 h-4" /> Sign Out
                            </Button>
                        </div>

                        <div className="grid lg:grid-cols-4 gap-8">
                            {/* Left Sidebar Info */}
                            <div className="lg:col-span-1 space-y-6">
                                <Card>
                                    <CardHeader className="pb-4">
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <User className="w-4 h-4 text-primary" /> Profile Details
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4 text-sm">
                                        <div>
                                            <p className="text-muted-foreground mb-1 uppercase text-[10px] font-bold tracking-widest">Name</p>
                                            <p className="font-semibold">{user?.user_metadata?.full_name || "N/A"}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground mb-1 uppercase text-[10px] font-bold tracking-widest">Email</p>
                                            <p className="font-semibold truncate">{user?.email}</p>
                                        </div>
                                        <Button variant="ghost" className="w-full justify-start p-0 h-auto text-primary hover:bg-transparent" onClick={() => navigate('/contact')}>
                                            Need help? Contact support
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Main Activity */}
                            <div className="lg:col-span-3">
                                <Tabs defaultValue="orders" className="w-full">
                                    <TabsList className="grid w-full max-w-md grid-cols-2 mb-8 h-12 p-1 bg-muted/50">
                                        <TabsTrigger value="orders" className="gap-2 rounded-lg">
                                            <Package className="w-4 h-4" /> My Orders
                                        </TabsTrigger>
                                        <TabsTrigger value="reservations" className="gap-2 rounded-lg">
                                            <Utensils className="w-4 h-4" /> My Bookings
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="orders" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                                        {loading ? (
                                            <div className="h-64 flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                            </div>
                                        ) : orders.length === 0 ? (
                                            <Card className="text-center py-12">
                                                <CardContent className="space-y-4">
                                                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                                        <Package className="w-8 h-8 text-muted-foreground" />
                                                    </div>
                                                    <h3 className="text-xl font-bold">No orders yet</h3>
                                                    <p className="text-muted-foreground">Craving something delicious? Let's fix that!</p>
                                                    <Button onClick={() => navigate('/menu')} className="bg-gradient-primary">
                                                        Browse Menu
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        ) : (
                                            orders.map((order, idx) => (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: idx * 0.1 }}
                                                    key={order.id}
                                                >
                                                    <Card className="overflow-hidden border-2 border-transparent hover:border-primary/10 transition-all shadow-sm hover:shadow-md">
                                                        <CardHeader className="flex flex-row items-center justify-between pb-4 bg-muted/30">
                                                            <div>
                                                                <CardTitle className="text-base">Order #{order.id.slice(0, 8)}</CardTitle>
                                                                <CardDescription>{format(new Date(order.created_at), 'MMMM d, yyyy • h:mm a')}</CardDescription>
                                                            </div>
                                                            <Badge className={getStatusColor(order.order_status)}>
                                                                {order.order_status?.replace('_', ' ')}
                                                            </Badge>
                                                        </CardHeader>
                                                        <CardContent className="pt-6">
                                                            <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
                                                                <div className="space-y-3 flex-1">
                                                                    <div className="flex items-start gap-2 text-sm">
                                                                        <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                                                                        <span>{order.delivery_address}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2 text-sm">
                                                                        <Clock className="w-4 h-4 text-muted-foreground" />
                                                                        <span>Estimated Arrival: {order.estimated_delivery_time ? format(new Date(order.estimated_delivery_time), 'h:mm a') : 'Calculating...'}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="text-2xl font-black text-primary">${order.total_amount}</p>
                                                                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">{order.payment_method?.toUpperCase()} • {order.payment_status}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-3">
                                                                {(order.order_status === 'preparing' || order.order_status === 'out_for_delivery') && (
                                                                    <Button className="flex-1 bg-primary shadow-glow hover:scale-[1.01] transition-transform" onClick={() => navigate(`/track/${order.id}`)}>
                                                                        Track Order
                                                                    </Button>
                                                                )}
                                                                <Button variant="outline" className="flex-1" onClick={() => navigate('/menu')}>
                                                                    Order Again
                                                                </Button>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </motion.div>
                                            ))
                                        )}
                                    </TabsContent>

                                    <TabsContent value="reservations" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                                        {loading ? (
                                            <div className="h-64 flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                            </div>
                                        ) : reservations.length === 0 ? (
                                            <Card className="text-center py-12">
                                                <CardContent className="space-y-4">
                                                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                                        <Utensils className="w-8 h-8 text-muted-foreground" />
                                                    </div>
                                                    <h3 className="text-xl font-bold">No reservations</h3>
                                                    <p className="text-muted-foreground">Planning a special dinner? Book your table now!</p>
                                                    <Button onClick={() => navigate('/reservations')} className="bg-gradient-primary">
                                                        Book a Table
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        ) : (
                                            reservations.map((res, idx) => (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: idx * 0.1 }}
                                                    key={res.id}
                                                >
                                                    <Card className="shadow-sm hover:shadow-md transition-shadow">
                                                        <CardHeader className="flex flex-row items-center justify-between">
                                                            <div>
                                                                <CardTitle className="text-lg">{format(new Date(res.reservation_date), 'EEEE, MMMM d')}</CardTitle>
                                                                <CardDescription className="flex items-center gap-2">
                                                                    <Clock className="w-3 h-3" /> {res.reservation_time} • {res.party_size} People
                                                                </CardDescription>
                                                            </div>
                                                            <Badge className={getStatusColor(res.status)}>
                                                                {res.status}
                                                            </Badge>
                                                        </CardHeader>
                                                    </Card>
                                                </motion.div>
                                            ))
                                        )}
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </>
    );
};

export default CustomerDashboard;
