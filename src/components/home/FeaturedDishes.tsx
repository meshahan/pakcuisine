import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Flame, Leaf, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const featuredDishes = [
  {
    id: 1,
    name: "Chicken Biryani",
    description: "Fragrant basmati rice layered with tender chicken, aromatic spices, and saffron.",
    price: 18.99,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=500&auto=format&fit=crop",
    isSpicy: true,
    isVegetarian: false,
    rating: 4.9,
    badge: "Chef's Special",
  },
  {
    id: 2,
    name: "Lamb Karahi",
    description: "Succulent lamb cooked in a wok with tomatoes, ginger, and green chilies.",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1545247181-516773cae754?q=80&w=500&auto=format&fit=crop",
    isSpicy: true,
    isVegetarian: false,
    rating: 4.8,
    badge: "Most Popular",
  },
  {
    id: 3,
    name: "Seekh Kebab",
    description: "Minced lamb skewers seasoned with herbs and spices, grilled to perfection.",
    price: 16.99,
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=500&auto=format&fit=crop",
    isSpicy: false,
    isVegetarian: false,
    rating: 4.7,
    badge: null,
  },
  {
    id: 4,
    name: "Paneer Tikka",
    description: "Marinated cottage cheese cubes grilled with bell peppers and onions.",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?q=80&w=500&auto=format&fit=crop",
    isSpicy: false,
    isVegetarian: true,
    rating: 4.6,
    badge: "Vegetarian",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

export function FeaturedDishes() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-primary font-semibold uppercase tracking-widest text-sm">Our Specialties</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-2 mb-4 leading-tight">
            Chef's <span className="text-primary">Recommended</span> Dishes
          </h2>
          <div className="h-1 w-20 bg-primary mx-auto mb-6 rounded-full" />
          <p className="text-muted-foreground text-lg">
            Discover our most beloved dishes, crafted with authentic recipes and premium ingredients.
          </p>
        </motion.div>

        {/* Dishes Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {featuredDishes.map((dish) => (
            <motion.div
              key={dish.id}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="group bg-card rounded-2xl overflow-hidden border border-border/50 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {dish.badge && (
                  <Badge className="absolute top-4 left-4 bg-primary/90 backdrop-blur-md text-primary-foreground border-none px-3 py-1 shadow-lg">
                    {dish.badge}
                  </Badge>
                )}

                {/* Rating */}
                <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md border border-white/20 rounded-full px-2.5 py-1 flex items-center gap-1.5 text-white shadow-xl">
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  <span className="text-xs font-bold">{dish.rating}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                    {dish.name}
                  </h3>
                  <div className="text-primary font-black text-lg">
                    ${dish.price}
                  </div>
                </div>
                <p className="text-muted-foreground text-sm mb-5 line-clamp-2 leading-relaxed">
                  {dish.description}
                </p>

                {/* Footer info & tags */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {dish.isSpicy && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-500/10 px-2.5 py-1 rounded-md">
                        <Flame className="w-3 h-3" />
                        Spicy
                      </span>
                    )}
                    {dish.isVegetarian && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-green-600 bg-green-500/10 px-2.5 py-1 rounded-md">
                        <Leaf className="w-3 h-3" />
                        Veg
                      </span>
                    )}
                  </div>

                  <Link
                    to="/menu"
                    className="text-primary text-xs font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300"
                  >
                    View Details <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <Button asChild size="lg" className="h-14 px-10 rounded-xl bg-primary hover:bg-primary/90 text-white shadow-glow group">
            <Link to="/menu">
              Explore Everything
              <ArrowRight className="ml-3 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
