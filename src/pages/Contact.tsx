import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

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

      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />

        <main className="flex-1 pt-24">
          {/* Hero Section */}
          <section className="relative py-24 overflow-hidden bg-secondary text-white">
            <div className="absolute inset-0 pattern-overlay opacity-10" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

            <div className="container mx-auto px-4 relative z-10">
              <motion.div
                className="max-w-3xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1 mb-6 backdrop-blur-md">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium tracking-wide">We're here to help</span>
                </div>
                <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight">
                  Let's Start a <span className="text-primary">Conversation</span>
                </h1>
                <p className="text-white/60 text-xl leading-relaxed max-w-2xl">
                  Whether you're planning an event, have a question about our menu, or just want to say hello—we'd love to hear from you.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Contact Content */}
          <section className="py-24 bg-background">
            <div className="container mx-auto px-4">
              <div className="grid lg:grid-cols-2 gap-20 items-start">

                {/* Contact Info Column */}
                <motion.div
                  className="space-y-12"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="space-y-6">
                    <h2 className="font-display text-4xl font-bold text-foreground">
                      Contact Information
                    </h2>
                    <p className="text-muted-foreground text-lg leading-relaxed max-w-lg">
                      Fill out the form and our team will get back to you within 24 hours. We're excited to hear from you!
                    </p>
                  </div>

                  <div className="grid gap-8">
                    <div className="flex items-center gap-6 p-6 rounded-3xl bg-muted/30 border border-border/50 group hover:bg-muted transition-all duration-300">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                        <MapPin className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-foreground">Visit Us</h3>
                        <p className="text-muted-foreground">123 Spice Street, Flavor District, NY</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 p-6 rounded-3xl bg-muted/30 border border-border/50 group hover:bg-muted transition-all duration-300">
                      <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-secondary group-hover:text-white transition-all">
                        <Phone className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-foreground">Call Us</h3>
                        <p className="text-muted-foreground">(123) 456-7890</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 p-6 rounded-3xl bg-muted/30 border border-border/50 group hover:bg-muted transition-all duration-300">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                        <Mail className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-foreground">Email Us</h3>
                        <p className="text-muted-foreground">hello@pakcuisine.com</p>
                      </div>
                    </div>
                  </div>

                  {/* Operational Hours */}
                  <div className="p-8 rounded-3xl bg-[#0A0F14] text-white overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                    <div className="relative z-10 flex items-start gap-5">
                      <Clock className="w-8 h-8 text-primary mt-1" />
                      <div className="space-y-4">
                        <h3 className="font-bold text-xl uppercase tracking-tighter">Kitchen Hours</h3>
                        <div className="space-y-2 text-sm text-white/60">
                          <div className="flex justify-between w-64 border-b border-white/5 pb-2">
                            <span>Mon-Thu</span>
                            <span className="text-white font-medium">11:00 AM - 10:00 PM</span>
                          </div>
                          <div className="flex justify-between w-64 border-b border-white/5 pb-2">
                            <span>Fri-Sat</span>
                            <span className="text-white font-medium">11:00 AM - 11:00 PM</span>
                          </div>
                          <div className="flex justify-between w-64">
                            <span>Sunday</span>
                            <span className="text-white font-medium">12:00 PM - 09:00 PM</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Contact Form Column */}
                <motion.div
                  className="bg-card rounded-[2.5rem] p-10 shadow-2xl border border-border/50 relative overflow-hidden"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  {isSuccess ? (
                    <div className="text-center py-20">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-secondary mb-8 shadow-glow"
                      >
                        <CheckCircle className="w-12 h-12 text-secondary-foreground" />
                      </motion.div>
                      <h3 className="font-display text-4xl font-bold text-foreground mb-4">
                        Message Sent!
                      </h3>
                      <p className="text-muted-foreground text-lg">
                        Thank you for reaching out. We've received your inquiry and will be in touch within 24 hours.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="mb-10">
                        <h2 className="font-display text-3xl font-bold text-foreground mb-2">
                          Send a Message
                        </h2>
                        <p className="text-muted-foreground">Required fields are marked with *</p>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid sm:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider pl-1">Full Name *</Label>
                            <Input
                              id="name"
                              placeholder="e.g. John Wick"
                              required
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              className="h-12 bg-muted/50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                          </div>
                          <div className="space-y-3">
                            <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider pl-1">Email Address *</Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="your@email.com"
                              required
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              className="h-12 bg-muted/50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider pl-1">Phone Number</Label>
                            <Input
                              id="phone"
                              type="tel"
                              placeholder="+1 (555) 000-0000"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              className="h-12 bg-muted/50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                          </div>
                          <div className="space-y-3">
                            <Label htmlFor="subject" className="text-xs font-bold uppercase tracking-wider pl-1">Subject</Label>
                            <Input
                              id="subject"
                              placeholder="Catering, Feedback, etc."
                              value={formData.subject}
                              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                              className="h-12 bg-muted/50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="message" className="text-xs font-bold uppercase tracking-wider pl-1">Your Message *</Label>
                          <Textarea
                            id="message"
                            placeholder="Tell us everything..."
                            rows={6}
                            required
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            className="bg-muted/50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                          />
                        </div>

                        <Button
                          type="submit"
                          size="lg"
                          className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl shadow-glow transition-all active:scale-[0.98] group"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Delivering your message..." : "Send Message"}
                          <Send className="ml-3 w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </Button>
                      </form>
                    </>
                  )}
                </motion.div>

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

export default Contact;
