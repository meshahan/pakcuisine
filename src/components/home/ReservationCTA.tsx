import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, ThumbsUp, AlertCircle, CheckCircle, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function ReservationCTA() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category) {
      toast({
        title: "Category Required",
        description: "Please select a feedback category.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("contact_submissions").insert({
        name: formData.name,
        email: formData.email,
        subject: formData.category, // Storing category in subject field
        message: formData.phone ? `Phone: ${formData.phone}\n\n${formData.message}` : formData.message,
      });

      if (error) throw error;

      // Send Email Notification to Admin
      await supabase.functions.invoke('send-email', {
        body: {
          type: 'feedback',
          template: 'admin_alert',
          payload: {
            id: 'MSG-' + Math.floor(Math.random() * 10000),
            name: formData.name,
            email: formData.email,
          },
          items: [
            { quantity: 1, name: `Category: ${formData.category}` },
            { quantity: 1, name: `Phone: ${formData.phone || 'N/A'}` },
            { quantity: 1, name: `Message: ${formData.message}` }
          ]
        }
      });

      setIsSuccess(true);
      toast({
        title: "Feedback Received!",
        description: "Thank you for helping us improve. We value your input.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <section className="py-24 bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 pattern-overlay opacity-50" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary mb-6">
              <CheckCircle className="w-10 h-10 text-primary-foreground" />
            </div>
            <h2 className="font-display text-4xl font-bold text-primary-foreground mb-4">
              Thank You for Your Feedback!
            </h2>
            <p className="text-secondary-foreground/80 text-lg mb-8">
              We've received your {formData.category.toLowerCase()}. Your suggestions help us
              maintain the professional standards of Pak Cuisine.
            </p>
            <Button
              onClick={() => setIsSuccess(false)}
              className="bg-background text-foreground hover:bg-background/90 border border-border shadow-sm font-bold h-12 px-8 rounded-xl"
            >
              Submit More Feedback
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-secondary relative overflow-hidden">
      {/* Pattern Overlay */}
      <div className="absolute inset-0 pattern-overlay opacity-50" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <span className="text-primary font-medium uppercase tracking-wider">Share Your Thoughts</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mt-2 mb-6">
              We Value Your
              <span className="block text-primary">Feedback & Advice</span>
            </h2>
            <p className="text-secondary-foreground/80 text-lg mb-8 max-w-lg leading-relaxed">
              At Pak Cuisine, we are committed to excellence. Whether you have a complaint,
              advice for improvement, or service suggestions, we're listening to every word.
            </p>
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                  <AlertCircle className="w-6 h-6 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-primary-foreground font-semibold">Quality Complaints</p>
                  <p className="text-secondary-foreground/70 text-sm">Direct line for your concerns</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                  <ThumbsUp className="w-6 h-6 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-primary-foreground font-semibold">Service Advice</p>
                  <p className="text-secondary-foreground/70 text-sm">Help us enhance your dining experience</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-primary-foreground font-semibold">Growth Suggestions</p>
                  <p className="text-secondary-foreground/70 text-sm">Share your ideas for our improvement</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-card rounded-2xl p-8 shadow-2xl border border-primary/10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-bold uppercase tracking-widest opacity-70">How can we help? *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                  required
                >
                  <SelectTrigger className="h-14 bg-background/50 border-2 border-transparent focus:border-primary/50 transition-all rounded-xl">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Complaint">Complain</SelectItem>
                    <SelectItem value="Advise for Improvement">Advise for Improvement</SelectItem>
                    <SelectItem value="Services Advice">Services Advice</SelectItem>
                    <SelectItem value="General Feedback">General Feedback</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-bold uppercase tracking-widest opacity-70">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    className="h-14 bg-background/50 border-2 border-transparent focus:border-primary/50 transition-all rounded-xl"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-bold uppercase tracking-widest opacity-70">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    className="h-14 bg-background/50 border-2 border-transparent focus:border-primary/50 transition-all rounded-xl"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-bold uppercase tracking-widest opacity-70">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(123) 456-7890"
                  className="h-14 bg-background/50 border-2 border-transparent focus:border-primary/50 transition-all rounded-xl"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm font-bold uppercase tracking-widest opacity-70">Your Message *</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us what's on your mind..."
                  className="min-h-[120px] bg-background/50 border-2 border-transparent focus:border-primary/50 transition-all rounded-xl p-4"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full h-14 bg-gradient-primary hover:opacity-90 shadow-glow font-bold text-lg rounded-xl gap-2 mt-4"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : (
                  <>
                    Send Feedback
                    <Send className="w-5 h-5" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
