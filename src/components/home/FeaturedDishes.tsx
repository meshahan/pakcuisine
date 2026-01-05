import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Flame, Leaf, ArrowRight } from "lucide-react";

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

export function FeaturedDishes() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary font-medium uppercase tracking-wider">Our Specialties</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-2 mb-4">
            Chef's <span className="text-primary">Recommended</span> Dishes
          </h2>
          <p className="text-muted-foreground text-lg">
            Discover our most beloved dishes, crafted with authentic recipes and premium ingredients.
          </p>
        </div>

        {/* Dishes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredDishes.map((dish, index) => (
            <div
              key={dish.id}
              className="group bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {dish.badge && (
                  <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                    {dish.badge}
                  </Badge>
                )}
                {/* Rating */}
                <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                  <Star className="w-3 h-3 text-primary fill-primary" />
                  <span className="text-xs font-medium">{dish.rating}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-display text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                    {dish.name}
                  </h3>
                  <span className="text-primary font-bold whitespace-nowrap">
                    ${dish.price}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {dish.description}
                </p>
                {/* Tags */}
                <div className="flex items-center gap-2">
                  {dish.isSpicy && (
                    <span className="inline-flex items-center gap-1 text-xs text-accent bg-accent/10 px-2 py-1 rounded-full">
                      <Flame className="w-3 h-3" />
                      Spicy
                    </span>
                  )}
                  {dish.isVegetarian && (
                    <span className="inline-flex items-center gap-1 text-xs text-secondary bg-secondary/10 px-2 py-1 rounded-full">
                      <Leaf className="w-3 h-3" />
                      Vegetarian
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            <Link to="/menu">
              View Full Menu
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
