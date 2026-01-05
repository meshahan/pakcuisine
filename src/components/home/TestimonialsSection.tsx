import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
    rating: 5,
    text: "The best Pakistani food I've ever had outside of Pakistan! The biryani is absolutely incredible, and the service is exceptional. This is now our go-to spot for family dinners.",
    source: "Google Review",
  },
  {
    id: 2,
    name: "Michael Chen",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
    rating: 5,
    text: "Outstanding flavors and generous portions! The lamb karahi melts in your mouth. Perfect for a special occasion or just a craving for authentic cuisine.",
    source: "Yelp",
  },
  {
    id: 3,
    name: "Fatima Ahmed",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop",
    rating: 5,
    text: "Finally, a restaurant that brings back memories of home cooking! The naan is fresh, the curries are rich, and the atmosphere is warm and welcoming.",
    source: "Google Review",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-cream">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary font-medium uppercase tracking-wider">Testimonials</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-2 mb-4">
            What Our <span className="text-primary">Guests</span> Say
          </h2>
          <p className="text-muted-foreground text-lg">
            Don't just take our word for it — hear from our satisfied customers.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="bg-card rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow animate-fade-up relative"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Quote Icon */}
              <Quote className="absolute top-6 right-6 w-10 h-10 text-primary/10" />
              
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-primary fill-primary" />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-foreground mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.source}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Google Rating Badge */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 bg-card rounded-full px-8 py-4 shadow-md">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="w-8 h-8">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <div className="text-left">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-xl text-foreground">4.9</span>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-primary fill-primary" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Based on 500+ reviews</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
