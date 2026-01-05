import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star, Flame, Leaf, Search, Filter, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

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

      <div className="min-h-screen">
        <Navbar />

        <main className="pt-24">
          {/* Hero */}
          <section className="bg-secondary py-16 relative overflow-hidden">
            <div className="absolute inset-0 pattern-overlay opacity-30" />
            <div className="container mx-auto px-4 relative z-10 text-center">
              <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
                Our <span className="text-primary">Menu</span>
              </h1>
              <p className="text-secondary-foreground/80 text-lg max-w-2xl mx-auto">
                Explore our authentic Pakistani dishes, from sizzling kebabs to aromatic biryanis.
              </p>
            </div>
          </section>

          {/* Filters */}
          <section className="py-8 bg-cream border-b border-border sticky top-16 z-30">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                {/* Search */}
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search dishes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-2 justify-center">
                  {categories.map((cat) => (
                    <Button
                      key={cat.id}
                      variant={activeCategory === cat.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveCategory(cat.id)}
                      className={cn(
                        activeCategory === cat.id && "bg-gradient-primary"
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
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              {filteredItems.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-muted-foreground text-lg">No dishes found matching your criteria.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredItems.map((item, index) => (
                    <div
                      key={item.id}
                      className="group bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 animate-fade-up flex flex-col h-full"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      {/* Image */}
                      <div className="relative h-56 overflow-hidden shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {item.isFeatured && (
                          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                            Chef's Special
                          </Badge>
                        )}
                        <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                          <Star className="w-3 h-3 text-primary fill-primary" />
                          <span className="text-xs font-medium">{item.rating}</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <h3 className="font-display text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                            {item.name}
                          </h3>
                          <span className="text-primary font-bold text-lg whitespace-nowrap">
                            ${item.price}
                          </span>
                        </div>
                        <p className="text-muted-foreground mb-4 flex-1">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-2 mb-4">
                          {item.isSpicy && (
                            <span className="inline-flex items-center gap-1 text-xs text-accent bg-accent/10 px-2 py-1 rounded-full">
                              <Flame className="w-3 h-3" />
                              Spicy
                            </span>
                          )}
                          {item.isVegetarian && (
                            <span className="inline-flex items-center gap-1 text-xs text-secondary bg-secondary/10 px-2 py-1 rounded-full">
                              <Leaf className="w-3 h-3" />
                              Vegetarian
                            </span>
                          )}
                        </div>

                        <Button
                          className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                          onClick={() => {
                            addItem({
                              id: item.id.toString(),
                              name: item.name,
                              price: item.price,
                              image: item.image
                            });
                            openCart();
                          }}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Menu;
