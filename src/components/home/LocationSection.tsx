import { MapPin, Clock, Phone, Mail, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const openingHours = [
  { day: "Monday - Thursday", hours: "11:00 AM - 10:00 PM" },
  { day: "Friday - Saturday", hours: "11:00 AM - 11:00 PM" },
  { day: "Sunday", hours: "12:00 PM - 9:00 PM" },
];

export function LocationSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary font-medium uppercase tracking-wider">Find Us</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-2 mb-4">
            Visit <span className="text-primary">Our Restaurant</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            We're conveniently located in the heart of the city. Come experience our warm hospitality.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Map */}
          <div className="rounded-2xl overflow-hidden shadow-lg h-[400px] lg:h-full">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095343008!2d-74.00425878428698!3d40.74076794379132!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259bf5c1654f3%3A0xc80f9cfce5383d5d!2sGoogle!5e0!3m2!1sen!2sus!4v1629794729405!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "400px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Restaurant Location"
            />
          </div>

          {/* Info Cards */}
          <div className="space-y-6">
            {/* Address Card */}
            <div className="bg-card rounded-2xl p-6 shadow-md">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">Our Location</h3>
                  <p className="text-muted-foreground mb-3">
                    123 Spice Street, Flavor District<br />
                    New York, NY 10001
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href="https://maps.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Get Directions
                      <ExternalLink className="ml-2 w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>

            {/* Hours Card */}
            <div className="bg-card rounded-2xl p-6 shadow-md">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-xl font-semibold text-foreground mb-4">Opening Hours</h3>
                  <ul className="space-y-2">
                    {openingHours.map((item) => (
                      <li key={item.day} className="flex justify-between text-muted-foreground">
                        <span>{item.day}</span>
                        <span className="font-medium text-foreground">{item.hours}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-card rounded-2xl p-6 shadow-md">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-xl font-semibold text-foreground mb-4">Contact Us</h3>
                  <div className="space-y-3">
                    <a
                      href="tel:+1234567890"
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      (123) 456-7890
                    </a>
                    <a
                      href="mailto:info@pakcuisine.com"
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      info@pakcuisine.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
