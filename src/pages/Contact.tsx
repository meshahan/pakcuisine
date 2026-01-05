import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Send via Edge Function (handles SMTP/Formspree/Resend)
      const { error: emailError } = await supabase.functions.invoke("send-email", {
        body: {
          type: "contact",
          template: "admin_alert",
          payload: {
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
            phone: formData.phone
          }
        }
      });

      if (emailError) throw emailError;

      // 2. Also log to Supabase
      await supabase.from("contact_submissions").insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        subject: formData.subject || null,
        message: formData.message,
      });

      setIsSuccess(true);
      toast({
        title: "Message Sent!",
        description: "We'll get back to you as soon as possible.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us - Pak Cuisine | Get in Touch</title>
        <meta
          name="description"
          content="Have questions? Contact Pak Cuisine for reservations, catering inquiries, or feedback. We'd love to hear from you!"
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
                Contact <span className="text-primary">Us</span>
              </h1>
              <p className="text-secondary-foreground/80 text-lg max-w-2xl mx-auto">
                We'd love to hear from you. Get in touch for reservations, inquiries, or feedback.
              </p>
            </div>
          </section>

          {/* Contact Content */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="grid lg:grid-cols-2 gap-16">
                {/* Contact Info */}
                <div className="space-y-8">
                  <div>
                    <h2 className="font-display text-3xl font-bold text-foreground mb-6">
                      Get in Touch
                    </h2>
                    <p className="text-muted-foreground text-lg">
                      Whether you have a question about our menu, want to make a reservation,
                      or inquire about catering services, we're here to help.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Address</h3>
                        <p className="text-muted-foreground">
                          123 Spice Street, Flavor District<br />
                          New York, NY 10001
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                        <a href="tel:+1234567890" className="text-muted-foreground hover:text-primary transition-colors">
                          (123) 456-7890
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Email</h3>
                        <a href="mailto:info@pakcuisine.com" className="text-muted-foreground hover:text-primary transition-colors">
                          info@pakcuisine.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Hours</h3>
                        <p className="text-muted-foreground">
                          Mon-Thu: 11:00 AM - 10:00 PM<br />
                          Fri-Sat: 11:00 AM - 11:00 PM<br />
                          Sunday: 12:00 PM - 9:00 PM
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Map */}
                  <div className="rounded-2xl overflow-hidden shadow-lg h-64">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095343008!2d-74.00425878428698!3d40.74076794379132!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259bf5c1654f3%3A0xc80f9cfce5383d5d!2sGoogle!5e0!3m2!1sen!2sus!4v1629794729405!5m2!1sen!2sus"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      title="Restaurant Location"
                    />
                  </div>
                </div>

                {/* Contact Form */}
                <div className="bg-card rounded-2xl p-8 shadow-lg h-fit">
                  {isSuccess ? (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-6">
                        <CheckCircle className="w-8 h-8 text-secondary-foreground" />
                      </div>
                      <h3 className="font-display text-2xl font-bold text-foreground mb-4">
                        Message Sent!
                      </h3>
                      <p className="text-muted-foreground">
                        Thank you for reaching out. We'll get back to you within 24 hours.
                      </p>
                    </div>
                  ) : (
                    <>
                      <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                        Send Us a Message
                      </h2>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name *</Label>
                            <Input
                              id="name"
                              placeholder="John Doe"
                              required
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="john@example.com"
                              required
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                              id="phone"
                              type="tel"
                              placeholder="(123) 456-7890"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Input
                              id="subject"
                              placeholder="How can we help?"
                              value={formData.subject}
                              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="message">Message *</Label>
                          <Textarea
                            id="message"
                            placeholder="Tell us more..."
                            rows={5}
                            required
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          />
                        </div>

                        <Button
                          type="submit"
                          size="lg"
                          className="w-full bg-gradient-primary hover:opacity-90"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Sending..." : "Send Message"}
                          <Send className="ml-2 w-4 h-4" />
                        </Button>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Contact;
