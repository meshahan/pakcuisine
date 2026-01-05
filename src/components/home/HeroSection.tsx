import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, ChevronDown } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=2036&auto=format&fit=crop')`,
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-hero" />

      {/* Pattern Overlay */}
      <div className="absolute inset-0 pattern-overlay" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-32 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8 animate-fade-up">
          <Star className="w-4 h-4 text-primary fill-primary" />
          <span className="text-white text-sm font-medium">
            Authentic Pakistani Cuisine Since 2015
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          Taste the
          <span className="block text-primary">Authentic Flavors</span>
          of Pakistan
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: "0.2s" }}>
          From sizzling kebabs to aromatic biryanis, experience the rich culinary heritage
          of South Asia in every bite.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <Button
            asChild
            size="lg"
            className="bg-gradient-primary hover:opacity-90 shadow-glow text-lg px-8 py-6"
          >
            <Link to="/reservations">
              Book a Table
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-lg px-8 py-6"
          >
            <Link to="/menu">Explore Menu</Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 mt-16 pt-16 border-t border-white/20 animate-fade-up" style={{ animationDelay: "0.4s" }}>
          <div className="text-center">
            <p className="text-4xl md:text-5xl font-display font-bold text-primary">50+</p>
            <p className="text-white/80 mt-1">Signature Dishes</p>
          </div>
          <div className="text-center">
            <p className="text-4xl md:text-5xl font-display font-bold text-primary">10+</p>
            <p className="text-white/80 mt-1">Years Experience</p>
          </div>
          <div className="text-center">
            <p className="text-4xl md:text-5xl font-display font-bold text-primary">4.9</p>
            <p className="text-white/80 mt-1">Rating on Google</p>
          </div>
          <div className="text-center">
            <p className="text-4xl md:text-5xl font-display font-bold text-primary">15K+</p>
            <p className="text-white/80 mt-1">Happy Customers</p>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer flex flex-col items-center gap-2 opacity-80 hover:opacity-100 transition-opacity" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
        <span className="text-white/50 text-[10px] font-bold uppercase tracking-[0.2em]">Scroll</span>
        <div className="w-10 h-10 rounded-full border-2 border-primary/20 flex items-center justify-center bg-white/5 backdrop-blur-sm">
          <ChevronDown className="w-6 h-6 text-primary" />
        </div>
      </div>
    </section>
  );
}
