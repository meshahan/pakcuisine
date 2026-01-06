import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('is_visible', true)
        .order('display_order', { ascending: true });

      if (!error && data) {
        setImages(data);
      }
      setLoading(false);
    };

    fetchImages();
  }, []);

  const handlePrev = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1);
    }
  };

  const handleNext = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === images.length - 1 ? 0 : selectedImage + 1);
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
          <section className="py-16 bg-background min-h-[400px]">
            <div className="container mx-auto px-4">
              {loading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="w-10 h-10 animate-spin text-primary" />
                </div>
              ) : images.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                  Our galley is being updated. Please check back soon!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {images.map((image, index) => (
                    <div
                      key={image.id}
                      className="group animate-fade-up bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div
                        className="relative aspect-[4/3] overflow-hidden cursor-pointer"
                        onClick={() => setSelectedImage(index)}
                      >
                        <img
                          src={image.image_url}
                          alt={image.caption || "Gallery image"}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      {image.caption && (
                        <div className="p-4 bg-card border-t border-border">
                          <p className="text-sm font-medium text-foreground leading-relaxed">
                            {image.caption}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </main>

        {/* Lightbox */}
        <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl bg-foreground/95 border-none p-0 outline-none">
            {selectedImage !== null && images[selectedImage] && (
              <div className="relative">
                <img
                  src={images[selectedImage].image_url}
                  alt={images[selectedImage].caption || ""}
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
                    {images[selectedImage].caption}
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
