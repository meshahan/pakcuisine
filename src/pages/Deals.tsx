import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Tag, Mail, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";

interface Deal {
    id: string;
    title: string;
    description: string;
    price: number;
    original_price?: number;
    image_url: string;
    created_at: string;
}

export default function Deals() {
    const [deals, setDeals] = useState<Deal[]>([]);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState("");
    const [subscribing, setSubscribing] = useState(false);
    const { toast } = useToast();
    const { addItem, openCart } = useCart();

    useEffect(() => {
        fetchDeals();
    }, []);

    const fetchDeals = async () => {
        try {
            const { data, error } = await supabase
                .from("deals")
                .select("*")
                .eq("is_active", true)
                .order("created_at", { ascending: false });

            if (error) throw error;
            setDeals(data || []);
        } catch (error) {
            console.error("Error fetching deals:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setSubscribing(true);
        try {
            const { error } = await supabase.from("subscribers").insert({ email });
            if (error) {
                if (error.code === '23505') { // Unique violation
                    toast({
                        title: "Already Subscribed!",
                        description: "You are already on our deals list.",
                    });
                    return;
                }
                throw error;
            }

            // Send confirmation email
            await supabase.functions.invoke('send-email', {
                body: {
                    template: 'subscription_confirmation',
                    payload: { email }
                }
            });

            toast({
                title: "Subscribed Successfully!",
                description: "You'll be the first to know about our hot deals.",
            });
            setEmail("");
        } catch (error) {
            toast({
                title: "Subscription Failed",
                description: "Something went wrong. Please try again.",
                variant: "destructive",
            });
        } finally {
            setSubscribing(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <main className="flex-1 pt-32 pb-16 safe-top">
                {/* Hero Section */}
                <section className="container px-4 text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Badge variant="outline" className="mb-4 px-4 py-1 text-sm border-primary/50 text-primary">
                            <Sparkles className="w-3 h-3 mr-2 fill-primary" /> Limited Time Offers
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 text-gradient-primary">
                            Hot Deals & Specials
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Grab your favorite authentic Pakistani dishes at unbeatable prices.
                            These offers won't last long!
                        </p>
                    </motion.div>
                </section>

                {/* Deals Grid */}
                <section className="container px-4 mb-24">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : deals.length === 0 ? (
                        <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed border-muted-foreground/20">
                            <Tag className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                            <h3 className="text-xl font-bold mb-2">No Active Deals Right Now</h3>
                            <p className="text-muted-foreground">Check back later or subscribe below to get notified!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {deals.map((deal, index) => (
                                <motion.div
                                    key={deal.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <Card className="overflow-hidden h-full flex flex-col border-border/50 hover:border-primary/50 transition-colors shadow-lg hover:shadow-xl hover:shadow-primary/5">
                                        <div className="relative h-64 overflow-hidden">
                                            <img
                                                src={deal.image_url || "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1000&auto=format&fit=crop"}
                                                alt={deal.title}
                                                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                                            />
                                            <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                                                <div className="bg-red-500 text-white font-bold px-3 py-1 rounded-full shadow-lg text-sm flex items-center gap-1 animate-pulse">
                                                    <Tag className="w-3 h-3" /> SPECIAL
                                                </div>
                                                {deal.original_price && deal.price / deal.original_price < 0.7 && (
                                                    <div className="bg-orange-500 text-white font-bold px-3 py-1 rounded-full shadow-lg text-[10px] uppercase tracking-tighter">
                                                        Best Deal!
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="p-6 flex-1 flex flex-col">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-2xl font-display font-bold">{deal.title}</h3>
                                                <div className="text-right">
                                                    <span className="block text-2xl font-bold text-primary">${deal.price}</span>
                                                    {deal.original_price && (
                                                        <span className="text-sm text-muted-foreground line-through">${deal.original_price}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-muted-foreground mb-6 flex-1">{deal.description}</p>

                                            <Button
                                                className="w-full group"
                                                size="lg"
                                                onClick={() => {
                                                    addItem({
                                                        id: deal.id,
                                                        name: deal.title,
                                                        price: deal.price,
                                                        image: deal.image_url
                                                    });
                                                    openCart();
                                                }}
                                            >
                                                Order Now
                                                <Tag className="w-4 h-4 ml-2 group-hover:rotate-12 transition-transform" />
                                            </Button>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Subscription Section */}
                <section className="bg-primary/5 dark:bg-primary/10 py-20">
                    <div className="container px-4 text-center">
                        <div className="max-w-xl mx-auto">
                            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Mail className="w-8 h-8 text-primary" />
                            </div>
                            <h2 className="text-3xl font-bold mb-4">Never Miss a Deal!</h2>
                            <p className="text-muted-foreground mb-8">
                                Join our exclusive mailing list and get notified about flash sales, happy hours, and new menu items.
                            </p>

                            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md mx-auto">
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="bg-background"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <Button type="submit" disabled={subscribing}>
                                    {subscribing ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        "Subscribe"
                                    )}
                                </Button>
                            </form>
                            <p className="text-xs text-muted-foreground mt-4">
                                We respect your inbox. No spam, ever.
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
