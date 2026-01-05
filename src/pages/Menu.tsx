import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star, Flame, Leaf, Search, ShoppingCart, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

import { categories, menuItems } from "@/lib/data";

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { addItem, openCart } = useCart();

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <Helmet>
        <title>Menu - Pak Cuisine | Pakistani Restaurant</title>
        <meta
          name="description"
          content="Explore our authentic Pakistani menu featuring biryanis, kebabs, curries, and more. Halal certified with vegetarian options available."
        />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />

        <main className="flex-1 pt-24">
          {/* Hero Section */}
          <section className="relative py-24 overflow-hidden bg-[#0A0F14] text-white">
            {/* Decorative gradients */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

            <div className="container mx-auto px-4 relative z-10">
              <motion.div
                className="max-w-3xl"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1 mb-6 backdrop-blur-md">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium tracking-wide">Authentic Flavors</span>
                </div>
                <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight">
                  The Art of <span className="text-gradient-primary">Pakistani</span> Cuisine
                </h1>
                <p className="text-gray-400 text-xl leading-relaxed max-w-2xl">
                  From traditional family recipes to modern culinary interpretations, explore our diverse selection of authentic dishes.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Controls Hook */}
          <section className="sticky top-[64px] z-40 bg-background/80 backdrop-blur-xl border-b border-border shadow-sm">
            <div className="container mx-auto px-4 py-6">
              <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                {/* Search */}
                <div className="relative w-full lg:w-96 group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    placeholder="What are you craving?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12 bg-muted/50 border-border/50 focus:bg-background transition-all rounded-xl"
                  />
                </div>

                {/* Filter Categories */}
                <div className="flex flex-wrap gap-2 justify-center lg:justify-end">
                  {categories.map((cat) => (
                    <Button
                      key={cat.id}
                      variant={activeCategory === cat.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveCategory(cat.id)}
                      className={cn(
                        "rounded-full px-5 h-10 transition-all duration-300",
                        activeCategory === cat.id
                          ? "bg-primary text-white shadow-glow translate-y-[-2px]"
                          : "hover:border-primary/50 hover:bg-primary/5"
                      )}
                    >
                      {cat.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Menu Grid */}
          <section className="py-16 bg-background relative">
            <div className="container mx-auto px-4">
              <AnimatePresence mode="wait">
                {filteredItems.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-32"
                  >
                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                      <Search className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">No dishes found</h3>
                    <p className="text-muted-foreground">Try adjusting your filters or search keywords.</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8"
                  >
                    {filteredItems.map((item, index) => (
                      <motion.div
                        layout
                        key={item.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group relative flex flex-col bg-card rounded-[2rem] overflow-hidden border border-border/50 hover:border-primary/30 shadow-sm hover:shadow-2xl transition-all duration-500"
                      >
                        {/* Image Container */}
                        <div className="relative h-64 overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                          {/* Top Badges */}
                          <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                            {item.isFeatured && (
                              <Badge className="bg-primary/90 backdrop-blur-md border-none px-3 py-1 text-xs font-bold shadow-lg">
                                Chef's Choice
                              </Badge>
                            )}
                            <div className="bg-black/40 backdrop-blur-md border border-white/20 rounded-full px-2 py-1 flex items-center gap-1.5 text-white shadow-xl ml-auto">
                              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                              <span className="text-[10px] font-bold">{item.rating}</span>
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-8 flex flex-col flex-1">
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <h3 className="font-display text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                              {item.name}
                            </h3>
                            <div className="flex flex-col items-end">
                              <span className="text-primary font-black text-xl">
                                ${item.price}
                              </span>
                            </div>
                          </div>

                          <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                            {item.description}
                          </p>

                          {/* Item Footer */}
                          <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center gap-2">
                              {item.isSpicy && (
                                <span className="bg-red-500/10 text-red-600 p-2 rounded-lg" title="Spicy">
                                  <Flame className="w-4 h-4" />
                                </span>
                              )}
                              {item.isVegetarian && (
                                <span className="bg-green-500/10 text-green-600 p-2 rounded-lg" title="Vegetarian">
                                  <Leaf className="w-4 h-4" />
                                </span>
                              )}
                            </div>

                            <Button
                              onClick={() => {
                                addItem({
                                  id: item.id.toString(),
                                  name: item.name,
                                  price: item.price,
                                  image: item.image
                                });
                                openCart();
                              }}
                              className="rounded-xl px-6 h-12 bg-secondary hover:bg-secondary/90 text-white font-bold transition-all shadow-glow hover:scale-[1.02] active:scale-[0.98]"
                            >
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              Order Now
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Menu;

export default Menu;
