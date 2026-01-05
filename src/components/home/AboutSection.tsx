import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChefHat, Award, Heart } from "lucide-react";

const features = [
  {
    icon: ChefHat,
    title: "Master Chefs",
    description: "Our chefs bring decades of experience from Pakistan's finest kitchens.",
  },
  {
    icon: Award,
    title: "Premium Quality",
    description: "We source only the freshest ingredients and authentic spices.",
  },
  {
    icon: Heart,
    title: "Made with Love",
    description: "Every dish is prepared with passion and respect for tradition.",
  },
];

export function AboutSection() {
  return (
    <section className="py-24 bg-cream">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image Grid */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?q=80&w=600&auto=format&fit=crop"
                    alt="Chef preparing biryani"
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?q=80&w=600&auto=format&fit=crop"
                    alt="Spices and ingredients"
                    className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=600&auto=format&fit=crop"
                    alt="Restaurant interior"
                    className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1574653853027-5382a3d23a15?q=80&w=600&auto=format&fit=crop"
                    alt="Pakistani kebabs"
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -right-6 bg-primary rounded-2xl p-6 shadow-lg hidden md:block">
              <p className="text-primary-foreground font-display text-4xl font-bold">10+</p>
              <p className="text-primary-foreground/80 text-sm">Years of Excellence</p>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            <div>
              <span className="text-primary font-medium uppercase tracking-wider">Our Story</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-2">
                A Culinary Journey from 
                <span className="text-primary"> Lahore to Your Table</span>
              </h2>
            </div>
            
            <p className="text-muted-foreground text-lg leading-relaxed">
              Founded in 2015, Pak Cuisine was born from a simple dream — to bring the authentic 
              flavors of Pakistan to food lovers everywhere. Our founder, Chef Ahmed Khan, grew up 
              in the bustling streets of Lahore, where every corner offered a new culinary adventure.
            </p>
            
            <p className="text-muted-foreground text-lg leading-relaxed">
              Today, we honor that heritage by using traditional recipes passed down through 
              generations, combined with the finest local ingredients. From our signature 
              Chicken Karahi to our aromatic Lamb Biryani, every dish tells a story of flavor, 
              tradition, and love.
            </p>

            {/* Features */}
            <div className="grid sm:grid-cols-3 gap-6 pt-4">
              {features.map((feature) => (
                <div key={feature.title} className="text-center sm:text-left">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>

            <Button asChild size="lg" className="bg-gradient-primary hover:opacity-90">
              <Link to="/about">Learn More About Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
