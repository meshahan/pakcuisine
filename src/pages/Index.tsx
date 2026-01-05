import { Helmet } from "react-helmet-async";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { AboutSection } from "@/components/home/AboutSection";
import { FeaturedDishes } from "@/components/home/FeaturedDishes";
import { ReservationCTA } from "@/components/home/ReservationCTA";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { LocationSection } from "@/components/home/LocationSection";
import { FAQSection } from "@/components/home/FAQSection";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Pak Cuisine - Authentic Pakistani Restaurant | Book a Table</title>
        <meta
          name="description"
          content="Experience authentic Pakistani flavors at Pak Cuisine. From aromatic biryanis to sizzling kebabs, enjoy traditional recipes made with love. Book your table today!"
        />
        <meta name="keywords" content="Pakistani restaurant, biryani, kebabs, halal food, karahi, Pakistani cuisine, South Asian food" />
        <link rel="canonical" href="https://pakcuisine.com" />
      </Helmet>
      
      <div className="min-h-screen">
        <Navbar />
        <main>
          <HeroSection />
          <AboutSection />
          <FeaturedDishes />
          <ReservationCTA />
          <TestimonialsSection />
          <LocationSection />
          <FAQSection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
