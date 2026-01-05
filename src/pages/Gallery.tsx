import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const galleryImages = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=800&auto=format&fit=crop",
    caption: "Signature Chicken Biryani",
    category: "food",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=800&auto=format&fit=crop",
    caption: "Elegant Dining Area",
    category: "interior",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1545247181-516773cae754?q=80&w=800&auto=format&fit=crop",
    caption: "Lamb Karahi",
    category: "food",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?q=80&w=800&auto=format&fit=crop",
    caption: "Fresh Spices",
    category: "kitchen",
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1574653853027-5382a3d23a15?q=80&w=800&auto=format&fit=crop",
    caption: "Seekh Kebabs",
    category: "food",
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?q=80&w=800&auto=format&fit=crop",
    caption: "Chef Preparing Dishes",
    category: "kitchen",
  },
  {
    id: 7,
    url: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=800&auto=format&fit=crop",
    caption: "Butter Chicken",
    category: "food",
  },
  {
    id: 8,
    url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop",
    caption: "Private Dining Room",
    category: "interior",
  },
  {
    id: 9,
    url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop",
    caption: "Special Biryani",
    category: "food",
  },
  {
    id: 10,
    url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop",
    caption: "Restaurant Ambiance",
    category: "interior",
  },
  {
    id: 11,
    url: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=800&auto=format&fit=crop",
    caption: "Grilled Kebabs",
    category: "food",
  },
  {
    id: 12,
    url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800&auto=format&fit=crop",
    caption: "Fine Dining Setup",
    category: "interior",
  },
];

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const handlePrev = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? galleryImages.length - 1 : selectedImage - 1);
    }
  };

  const handleNext = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === galleryImages.length - 1 ? 0 : selectedImage + 1);
    }
  };

  return (
    <>
      <Helmet>
        <title>Gallery - Pak Cuisine | Photos</title>
        <meta
          name="description"
          content="View our gallery of delicious Pakistani dishes, restaurant ambiance, and culinary creations at Pak Cuisine."
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
                Our <span className="text-primary">Gallery</span>
              </h1>
              <p className="text-secondary-foreground/80 text-lg max-w-2xl mx-auto">
                A visual feast of our dishes, restaurant, and culinary moments.
              </p>
            </div>
          </section>

          {/* Gallery Grid */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {galleryImages.map((image, index) => (
                  <div
                    key={image.id}
                    className="relative aspect-square overflow-hidden rounded-xl cursor-pointer group animate-fade-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={image.url}
                      alt={image.caption}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <p className="text-primary-foreground font-medium">{image.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>

        {/* Lightbox */}
        <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl bg-foreground/95 border-none p-0">
            {selectedImage !== null && (
              <div className="relative">
                <img
                  src={galleryImages[selectedImage].url}
                  alt={galleryImages[selectedImage].caption}
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-background/20 hover:bg-background/40 transition-colors"
                >
                  <X className="w-6 h-6 text-primary-foreground" />
                </button>
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/20 hover:bg-background/40 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-primary-foreground" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/20 hover:bg-background/40 transition-colors"
                >
                  <ChevronRight className="w-6 h-6 text-primary-foreground" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-foreground/80 to-transparent">
                  <p className="text-primary-foreground text-center font-medium">
                    {galleryImages[selectedImage].caption}
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Footer />
      </div>
    </>
  );
};

export default Gallery;
