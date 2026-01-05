import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Tag, Utensils, Sparkles, ArrowRight } from "lucide-react";
import { Helmet } from "react-helmet-async";

export default function OrderSelection() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Helmet>
                <title>Order Online - Pak Cuisine</title>
                <meta name="description" content="Choose your ordering experience. Check out our hot deals or browse the full menu." />
            </Helmet>

            <Navbar />

            <main className="flex-1 pt-32 pb-20 px-4">
                <div className="container mx-auto max-w-5xl">
                    <div className="text-center mb-16 space-y-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Badge variant="outline" className="px-4 py-1 text-sm border-primary/50 text-primary mb-4">
                                <Sparkles className="w-3 h-3 mr-2 fill-primary" /> Ready to Taste Perfection?
                            </Badge>
                            <h1 className="text-4xl md:text-6xl font-display font-bold text-gradient-primary">
                                Choose Your Experience
                            </h1>
                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                                Whether you're looking for limited-time specials or our full authentic range, we've got you covered.
                            </p>
                        </motion.div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                        {/* Hot Deals Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <Link to="/deals" className="group block h-full">
                                <Card className="relative h-full overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-primary/10 group-hover:-translate-y-2">
                                    <div className="aspect-[4/5] md:aspect-auto md:h-[500px] relative overflow-hidden">
                                        <img
                                            src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1000&auto=format&fit=crop"
                                            alt="Hot Deals"
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                                        <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                                            <div className="mb-4">
                                                <div className="inline-flex items-center gap-2 bg-red-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 shadow-lg animate-pulse">
                                                    <Tag className="w-3 h-3" /> Limited Time
                                                </div>
                                                <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">Hot Deals & Combos</h2>
                                                <p className="text-white/80 text-lg mb-6 leading-relaxed">
                                                    Save big on our most popular Pakistani platters, family bundles, and exclusive monthly specials.
                                                </p>
                                            </div>

                                            <Button className="w-full h-14 bg-primary hover:bg-primary/90 text-lg font-bold rounded-xl gap-2 shadow-glow group/btn">
                                                View Deals 🔥
                                                <ArrowRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        </motion.div>

                        {/* Full Menu Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <Link to="/menu" className="group block h-full">
                                <Card className="relative h-full overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-secondary/10 group-hover:-translate-y-2">
                                    <div className="aspect-[4/5] md:aspect-auto md:h-[500px] relative overflow-hidden">
                                        <img
                                            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop"
                                            alt="Full Menu"
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                                        <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                                            <div className="mb-4">
                                                <div className="inline-flex items-center gap-2 bg-secondary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 shadow-lg">
                                                    <Utensils className="w-3 h-3" /> Full Range
                                                </div>
                                                <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">Explore Full Menu</h2>
                                                <p className="text-white/80 text-lg mb-6 leading-relaxed">
                                                    Browse our complete range of authentic Pakistani cuisine—from sizzling karahis to refreshing lassis.
                                                </p>
                                            </div>

                                            <Button variant="outline" className="w-full h-14 border-white/20 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-lg font-bold rounded-xl gap-2 group/btn">
                                                Browse Menu 📋
                                                <ArrowRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
