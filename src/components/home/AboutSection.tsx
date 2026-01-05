import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChefHat, Award, Heart, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

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
    <section className="py-24 bg-cream relative overflow-hidden">
      {/* Decorative background circle */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image Grid */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                  <img
                    src="https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?q=80&w=600&auto=format&fit=crop"
                    alt="Chef preparing biryani"
                    className="w-full h-48 object-cover hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                  <img
                    src="https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?q=80&w=600&auto=format&fit=crop"
                    alt="Spices and ingredients"
                    className="w-full h-64 object-cover hover:scale-110 transition-transform duration-700"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-12">
                <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                  <img
                    src="https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=600&auto=format&fit=crop"
                    alt="Restaurant interior"
                    className="w-full h-64 object-cover hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                  <img
                    src="https://images.unsplash.com/photo-1574653853027-5382a3d23a15?q=80&w=600&auto=format&fit=crop"
                    alt="Pakistani kebabs"
                    className="w-full h-48 object-cover hover:scale-110 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <motion.div
              className="absolute -bottom-6 -right-6 bg-primary rounded-3xl p-8 shadow-2xl hidden md:block border-4 border-white"
              initial={{ scale: 0, rotate: -20 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", damping: 15, delay: 0.5 }}
            >
              <p className="text-white font-display text-5xl font-black mb-1">10+</p>
              <p className="text-white/90 text-xs font-bold uppercase tracking-widest">Years of<br />Excellence</p>
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div
            className="space-y-10"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div>
              <span className="text-primary font-bold uppercase tracking-[0.2em] text-xs">Our Heritage</span>
              <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground mt-4 leading-tight">
                A Culinary Journey from
                <span className="text-gradient-primary"> Lahore to Your Table</span>
              </h2>
            </div>

            <div className="space-y-6">
              <p className="text-muted-foreground text-lg leading-[1.8] font-light">
                Founded in 2015, Pak Cuisine was born from a simple dream — to bring the authentic
                flavors of Pakistan to food lovers everywhere. Our founder, Chef Ahmed Khan, grew up
                in the bustling streets of Lahore, where every corner offered a new culinary adventure.
              </p>

              <p className="text-muted-foreground text-lg leading-[1.8] font-light italic border-l-4 border-primary/30 pl-6 py-2">
                "Today, we honor that heritage by using traditional recipes passed down through
                generations, combined with the finest local ingredients."
              </p>
            </div>

            {/* Features */}
            <div className="grid sm:grid-cols-3 gap-8 pt-4">
              {features.map((feature, idx) => (
                <div key={feature.title} className="group flex flex-col items-center sm:items-start">
                  <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                    <feature.icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2 text-lg">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>

            <Button asChild size="lg" className="h-14 px-10 rounded-xl bg-primary hover:bg-primary/90 text-white shadow-glow group">
              <Link to="/about" className="flex items-center gap-3">
                Learn More About Us
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
