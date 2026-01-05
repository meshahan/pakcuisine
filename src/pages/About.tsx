import { Helmet } from "react-helmet-async";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChefHat, Award, Heart, Users, Utensils, Clock } from "lucide-react";

const values = [
  {
    icon: ChefHat,
    title: "Authentic Recipes",
    description: "Our recipes have been passed down through generations, preserving the true essence of Pakistani cuisine.",
  },
  {
    icon: Award,
    title: "Quality Ingredients",
    description: "We source only the finest, freshest ingredients to ensure every dish exceeds your expectations.",
  },
  {
    icon: Heart,
    title: "Made with Love",
    description: "Every dish is prepared with passion, care, and a deep respect for our culinary traditions.",
  },
  {
    icon: Users,
    title: "Family Atmosphere",
    description: "We treat every guest like family, creating a warm and welcoming dining experience.",
  },
];

const team = [
  {
    name: "Chef Ahmed Khan",
    role: "Executive Chef & Founder",
    image: "https://images.unsplash.com/photo-1581299894007-aaa50297cf16?q=80&w=800&auto=format&fit=crop",
    bio: "Born and raised in Lahore, Chef Ahmed brings 25 years of culinary expertise to Pak Cuisine.",
  },
  {
    name: "Chef Fatima Malik",
    role: "Head Chef",
    image: "https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?q=80&w=400&auto=format&fit=crop",
    bio: "Specializing in traditional Mughlai cuisine, Chef Fatima creates dishes that tell stories.",
  },
  {
    name: "Rashid Ali",
    role: "Restaurant Manager",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
    bio: "With a passion for hospitality, Rashid ensures every guest has an exceptional experience.",
  },
];

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Us - Pak Cuisine | Our Story</title>
        <meta
          name="description"
          content="Learn about Pak Cuisine's journey from Lahore to your table. Meet our passionate team and discover our commitment to authentic Pakistani flavors."
        />
      </Helmet>

      <div className="min-h-screen">
        <Navbar />

        <main className="pt-24">
          {/* Hero */}
          <section className="bg-secondary py-20 relative overflow-hidden">
            <div className="absolute inset-0 pattern-overlay opacity-30" />
            <div className="container mx-auto px-4 relative z-10 text-center">
              <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
                Our <span className="text-primary">Story</span>
              </h1>
              <p className="text-secondary-foreground/80 text-lg max-w-2xl mx-auto">
                A culinary journey from the heart of Lahore to your table.
              </p>
            </div>
          </section>

          {/* Story Section */}
          <section className="py-24 bg-background">
            <div className="container mx-auto px-4">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-6">
                  <span className="text-primary font-medium uppercase tracking-wider">Since 2015</span>
                  <h2 className="font-display text-4xl font-bold text-foreground">
                    From Lahore's Streets to Your Heart
                  </h2>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Pak Cuisine was born from a simple dream — to bring the authentic flavors of Pakistan
                    to food lovers everywhere. Our founder, Chef Ahmed Khan, grew up in the bustling streets
                    of Lahore, where every corner offered a new culinary adventure.
                  </p>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    In 2015, Chef Ahmed opened the doors to Pak Cuisine with a vision to recreate the
                    vibrant food culture of his homeland. Using traditional recipes passed down through
                    generations and the finest local ingredients, we've built a reputation for authentic,
                    flavorful dishes that transport our guests to the streets of Pakistan.
                  </p>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Today, Pak Cuisine stands as a testament to our commitment to quality, tradition,
                    and hospitality. Whether you're craving a comforting plate of biryani or an adventurous
                    taste of karahi, we invite you to experience the warmth and flavor of Pakistan.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <img
                    src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=400&auto=format&fit=crop"
                    alt="Pakistani cuisine"
                    className="rounded-2xl shadow-lg h-64 object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=400&auto=format&fit=crop"
                    alt="Restaurant interior"
                    className="rounded-2xl shadow-lg h-64 object-cover mt-8"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?q=80&w=400&auto=format&fit=crop"
                    alt="Spices"
                    className="rounded-2xl shadow-lg h-64 object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1574653853027-5382a3d23a15?q=80&w=400&auto=format&fit=crop"
                    alt="Kebabs"
                    className="rounded-2xl shadow-lg h-64 object-cover mt-8"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Values */}
          <section className="py-24 bg-cream">
            <div className="container mx-auto px-4">
              <div className="text-center max-w-2xl mx-auto mb-16">
                <span className="text-primary font-medium uppercase tracking-wider">Our Values</span>
                <h2 className="font-display text-4xl font-bold text-foreground mt-2">
                  What Makes Us <span className="text-primary">Special</span>
                </h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {values.map((value, index) => (
                  <div
                    key={value.title}
                    className="bg-card rounded-2xl p-8 text-center shadow-md hover:shadow-lg transition-shadow animate-fade-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
                      <value.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Team */}
          <section className="py-24 bg-background">
            <div className="container mx-auto px-4">
              <div className="text-center max-w-2xl mx-auto mb-16">
                <span className="text-primary font-medium uppercase tracking-wider">Meet the Team</span>
                <h2 className="font-display text-4xl font-bold text-foreground mt-2">
                  The Faces Behind <span className="text-primary">the Flavors</span>
                </h2>
              </div>
              <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                {team.map((member, index) => (
                  <div
                    key={member.name}
                    className="bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow animate-fade-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="h-64 overflow-hidden">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6 text-center">
                      <h3 className="font-display text-xl font-semibold text-foreground mb-1">
                        {member.name}
                      </h3>
                      <p className="text-primary font-medium mb-3">{member.role}</p>
                      <p className="text-muted-foreground text-sm">{member.bio}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-24 bg-secondary relative overflow-hidden">
            <div className="absolute inset-0 pattern-overlay opacity-30" />
            <div className="container mx-auto px-4 relative z-10 text-center">
              <h2 className="font-display text-4xl font-bold text-primary-foreground mb-6">
                Ready to Experience <span className="text-primary">Pak Cuisine</span>?
              </h2>
              <p className="text-secondary-foreground/80 text-lg max-w-2xl mx-auto mb-8">
                Join us for an unforgettable dining experience. Book your table today!
              </p>
              <Button asChild size="lg" className="bg-gradient-primary hover:opacity-90 shadow-glow">
                <Link to="/reservations">Book a Table</Link>
              </Button>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default About;
