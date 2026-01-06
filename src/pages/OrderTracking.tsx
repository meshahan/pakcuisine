import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, MessageSquare, Clock, ArrowLeft, Bike, Navigation } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format, addMinutes } from "date-fns";

const OrderTracking = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!id) return;
            const { data, error } = await supabase.from('orders').select('*').eq('id', id).single();
            if (error) {
                toast({ title: "Order not found", variant: "destructive" });
                navigate("/dashboard");
                return;
            }
            setOrder(data);
            setLoading(false);
        };

        fetchOrder();

        // Simulate progress for demo
        const interval = setInterval(() => {
            setProgress(prev => (prev < 100 ? prev + 5 : 100));
        }, 3000);

        return () => clearInterval(interval);
    }, [id, navigate]);

    if (loading) return (
        <div className="h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    const steps = [
        { label: "Order Received", status: "preparing", icon: Clock },
        { label: "Preparing Food", status: "preparing", icon: Utensils },
        { label: "Out for Delivery", status: "out_for_delivery", icon: Bike },
        { label: "Delivered", status: "delivered", icon: Navigation },
    ];

    const currentStepIndex = steps.findIndex(s => s.status === order?.order_status) || 0;

    return (
        <>
            <Helmet>
                <title>Track Order - Pak Cuisine</title>
            </Helmet>

            <div className="min-h-screen bg-background flex flex-col">
                <Navbar />

                <main className="flex-1 pt-24 pb-20">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <Button variant="ghost" className="mb-6 gap-2" onClick={() => navigate('/dashboard')}>
                            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                        </Button>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Tracking Map Simulation */}
                            <div className="space-y-6">
                                <Card className="overflow-hidden bg-[#0A0F14] h-[400px] relative border-none">
                                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                                        <div className="w-full h-full border-2 border-gray-800 border-dashed rounded-full scale-150 rotate-45" />
                                        <div className="absolute top-1/4 left-1/4 w-full h-full border-2 border-gray-800 border-dashed rounded-full scale-150" />
                                    </div>

                                    {/* Simulation Content */}
                                    <CardContent className="h-full flex flex-col items-center justify-center relative p-0 text-white">
                                        <div className="absolute top-10 left-10">
                                            <div className="w-6 h-6 bg-primary rounded-full animate-ping" />
                                            <div className="w-6 h-6 bg-primary rounded-full relative z-10 flex items-center justify-center">
                                                <MapPin className="w-3 h-3" />
                                            </div>
                                            <p className="mt-2 text-[10px] font-bold uppercase">Restaurant</p>
                                        </div>

                                        <div className="absolute bottom-10 right-10">
                                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.5)]">
                                                <User className="w-4 h-4" />
                                            </div>
                                            <p className="mt-2 text-[10px] font-bold uppercase text-right">You</p>
                                        </div>

                                        {/* Rider Icon */}
                                        <motion.div
                                            className="absolute bg-white text-black p-3 rounded-2xl shadow-2xl flex items-center gap-3 z-30"
                                            animate={{
                                                left: `${progress * 0.7 + 10}%`,
                                                top: `${progress * 0.7 + 10}%`
                                            }}
                                            transition={{ type: "spring", damping: 10 }}
                                        >
                                            <div className="bg-primary/10 p-2 rounded-lg">
                                                <Bike className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase leading-none mb-1">On the way</p>
                                                <p className="text-xs font-black">Ahmed Rizwan</p>
                                            </div>
                                        </motion.div>

                                        {/* Path line */}
                                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                            <motion.line
                                                x1="12.5%" y1="12.5%"
                                                x2={`${progress * 0.75 + 10}%`} y2={`${progress * 0.75 + 10}%`}
                                                stroke="hsl(var(--primary))"
                                                strokeWidth="2"
                                                strokeDasharray="4 4"
                                            />
                                        </svg>
                                    </CardContent>

                                    <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-xl p-4 rounded-2xl border border-white/10 z-20">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                                <Clock className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-white/60 font-medium">Estimated Arrival</p>
                                                <p className="text-xl font-black text-white">{order.estimated_delivery_time ? format(new Date(order.estimated_delivery_time), 'h:mm a') : 'Calculating...'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="flex items-center justify-between pb-6 border-b border-border mb-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-full bg-muted overflow-hidden">
                                                    <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100" alt="Courier" className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-lg">Ahmed Rizwan</p>
                                                    <p className="text-sm text-muted-foreground">Certified Premium Courier</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button size="icon" variant="outline" className="rounded-full h-12 w-12 border-primary/20 bg-primary/5 text-primary">
                                                    <Phone className="w-5 h-5" />
                                                </Button>
                                                <Button size="icon" variant="outline" className="rounded-full h-12 w-12 border-primary/20 bg-primary/5 text-primary">
                                                    <MessageSquare className="w-5 h-5" />
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-muted-foreground p-4 bg-muted/30 rounded-xl">
                                            <Bike className="w-5 h-5 text-primary" />
                                            <span>Ahmed is currently <strong>1.5km</strong> away from your location.</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Order Status Timeline */}
                            <div className="space-y-6">
                                <Card className="border-2 border-primary/10">
                                    <CardHeader>
                                        <CardTitle className="text-xl">Delivery Timeline</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-8">
                                        {steps.map((step, idx) => {
                                            const Icon = step.icon;
                                            const isDone = idx <= currentStepIndex;
                                            const isActive = idx === currentStepIndex;

                                            return (
                                                <div key={idx} className="flex gap-6 relative">
                                                    {idx < steps.length - 1 && (
                                                        <div className={`absolute left-5 top-10 w-0.5 h-10 ${isDone ? 'bg-primary' : 'bg-muted'}`} />
                                                    )}
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 transition-all ${isDone ? 'bg-primary text-white shadow-glow' : 'bg-muted text-muted-foreground'}`}>
                                                        <Icon className="w-5 h-5" />
                                                    </div>
                                                    <div className="pt-2">
                                                        <p className={`font-bold transition-colors ${isDone ? 'text-foreground' : 'text-muted-foreground'}`}>{step.label}</p>
                                                        {isActive && (
                                                            <p className="text-xs text-primary font-bold uppercase tracking-widest mt-1">In Progress...</p>
                                                        )}
                                                        {isDone && !isActive && (
                                                            <p className="text-xs text-muted-foreground mt-1">Completed</p>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Delivery Address</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                                                <MapPin className="w-5 h-5 text-muted-foreground" />
                                            </div>
                                            <p className="text-muted-foreground leading-relaxed">{order.delivery_address}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </>
    );
};

// Add required icons
const Utensils = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path><path d="M7 2v20"></path><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path></svg>
);

const User = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);

export default OrderTracking;
