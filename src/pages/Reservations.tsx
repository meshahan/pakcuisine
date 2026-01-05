import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Search, Minus, Plus, Trash2, ArrowRight, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const dishes = [
  { id: 1, name: "Special Chicken Biryani", price: 18.99, image: "biryani" },
  { id: 2, name: "Chapli Kebab", price: 13.99, image: "kebab" },
  { id: 3, name: "Lahori Chargha", price: 25.99, image: "chargha" },
  { id: 4, name: "Mutton Karahi", price: 22.99, image: "karahi" },
  { id: 5, name: "Garlic Naan", price: 3.99, image: "naan" },
];

const timeSlots = [
  "18:00", "18:30", "19:00", "19:30",
  "20:00", "20:30", "21:00", "21:30"
];

const Reservations = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    guest_name: "",
    guest_email: "",
    guest_phone: "",
    party_size: 2,
    reservation_date: "2026-04-01",
    reservation_time: "19:30",
    special_requests: "",
  });

  const [preOrder, setPreOrder] = useState<any[]>([]);

  const filteredDishes = useMemo(() => {
    return dishes.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery]);

  const totalToPrepare = useMemo(() => {
    return preOrder.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }, [preOrder]);

  const handleUpdateQuantity = (id: number, delta: number) => {
    setPreOrder(prev => {
      const existing = prev.find(item => item.id === id);
      if (existing) {
        const newQuantity = existing.quantity + delta;
        if (newQuantity <= 0) return prev.filter(item => item.id !== id);
        return prev.map(item => item.id === id ? { ...item, quantity: newQuantity } : item);
      }
      const dish = dishes.find(d => d.id === id);
      if (dish && delta > 0) return [...prev, { ...dish, quantity: 1 }];
      return prev;
    });
  };

  const handleRemoveItem = (id: number) => {
    setPreOrder(prev => prev.filter(item => item.id !== id));
  };

  const validateForm = () => {
    if (!formData.guest_name.trim() || !formData.guest_email.trim() || !formData.guest_phone.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in your Name, Email, and Phone Number.",
        variant: "destructive",
      });
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.guest_email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      // Prepare data for Formspree
      // 2. Log to Supabase
      const { data: reservation, error } = await supabase.from("reservations").insert({
        guest_name: formData.guest_name,
        guest_email: formData.guest_email,
        guest_phone: formData.guest_phone || null,
        party_size: formData.party_size,
        reservation_date: formData.reservation_date,
        reservation_time: formData.reservation_time,
        special_requests: formData.special_requests || null,
        status: "pending",
      })
        .select()
        .single();

      if (error) throw error;

      // 3. Send Transactional Email (Admin + Customer notification via Formspree)
      const { error: emailError } = await supabase.functions.invoke('send-email', {
        body: {
          type: 'reservation',
          template: 'admin_alert',
          payload: reservation,
          items: preOrder // Include the pre-ordered food items
        }
      });

      if (emailError) {
        console.error("Reservation admin alert error:", emailError);
      }

      // 4. Send Customer Confirmation Email
      await supabase.functions.invoke('send-email', {
        body: {
          type: 'reservation',
          template: 'customer_confirmation',
          payload: reservation,
          items: preOrder
        }
      });

      setIsSuccess(true);
      toast({
        title: "Reservation Submitted!",
        description: "We'll confirm your booking shortly via email.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit reservation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Reservations - Pak Cuisine | Book a Table</title>
        <meta name="description" content="Taste the Tradition. Reserve Your Spot. Authentic Pakistani flavors await." />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <Navbar />

        <main className="pt-32 pb-20 px-4">
          <div className="container mx-auto max-w-6xl">
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-card rounded-[2rem] p-12 shadow-2xl text-center border border-border"
              >
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-8">
                  <CheckCircle className="w-12 h-12 text-primary" />
                </div>
                <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">Reservation Confirmed!</h2>
                <p className="text-muted-foreground text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
                  Thank you for choosing Pak Cuisine. We've received your reservation for{" "}
                  <span className="text-primary font-bold">{formData.party_size} guests</span> on{" "}
                  <span className="text-primary font-bold">{new Date(formData.reservation_date).toLocaleDateString()}</span> at{" "}
                  <span className="text-primary font-bold">{formData.reservation_time}</span>.
                </p>
                <Button size="lg" onClick={() => setIsSuccess(false)} className="bg-gradient-primary">
                  Make Another Reservation
                </Button>
              </motion.div>
            ) : (
              <div className="space-y-12">
                {/* Header */}
                <div className="space-y-4">
                  <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight">
                    Taste the Tradition.<br />
                    <span className="text-primary">Reserve Your Spot.</span>
                  </h1>
                  <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
                    Authentic Pakistani flavors await. Bookings recommended for weekends.
                  </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-12">
                  {/* Left Column: Date, Time & Details */}
                  <div className="lg:col-span-7 space-y-12">
                    {/* 1. SELECT DATE & TIME */}
                    <section className="space-y-6">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">1</span>
                        <h2 className="text-xl font-bold tracking-widest uppercase">Select Date & Time</h2>
                      </div>

                      <div className="space-y-6">
                        {/* Date Picker (Simplified for UI matching) */}
                        <div className="relative group">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary">
                            <Calendar className="w-5 h-5" />
                          </div>
                          <Input
                            type="date"
                            className="bg-card h-16 pl-14 text-lg border-2 border-transparent focus:border-primary/50 transition-all rounded-2xl"
                            value={formData.reservation_date}
                            onChange={(e) => setFormData({ ...formData, reservation_date: e.target.value })}
                          />
                        </div>

                        {/* Time Grid */}
                        <div className="grid grid-cols-4 gap-3">
                          {timeSlots.map(time => (
                            <button
                              key={time}
                              onClick={() => setFormData({ ...formData, reservation_time: time })}
                              className={`h-14 rounded-xl font-bold transition-all border-2 ${formData.reservation_time === time
                                ? "bg-primary text-primary-foreground border-primary shadow-glow"
                                : "bg-card border-muted hover:border-primary/50"
                                }`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>
                    </section>

                    {/* 2. YOUR DETAILS */}
                    <section className="space-y-6">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">2</span>
                        <h2 className="text-xl font-bold tracking-widest uppercase">Your Details</h2>
                      </div>

                      <div className="space-y-4">
                        {/* Guest Counter */}
                        <div className="bg-card p-6 rounded-2xl flex items-center justify-between border-2 border-transparent group focus-within:border-primary/30">
                          <div>
                            <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-1">Guests</p>
                            <span className="text-2xl font-bold">{formData.party_size}</span>
                          </div>
                          <div className="flex items-center gap-6">
                            <button
                              onClick={() => setFormData(f => ({ ...f, party_size: Math.max(1, f.party_size - 1) }))}
                              className="w-10 h-10 rounded-full border-2 border-muted flex items-center justify-center hover:bg-primary/10 hover:border-primary transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setFormData(f => ({ ...f, party_size: f.party_size + 1 }))}
                              className="w-10 h-10 rounded-full border-2 border-muted flex items-center justify-center hover:bg-primary/10 hover:border-primary transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-1 gap-4">
                          <Input
                            placeholder="Full Name"
                            required
                            className={cn("bg-card h-16 px-6 text-lg border-2 border-transparent focus:border-primary/50 transition-all rounded-2xl", !formData.guest_name && "border-orange-200")}
                            value={formData.guest_name}
                            onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
                          />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <Input
                            placeholder="Email Address"
                            required
                            type="email"
                            className={cn("bg-card h-16 px-6 text-lg border-2 border-transparent focus:border-primary/50 transition-all rounded-2xl", !formData.guest_email && "border-orange-200")}
                            value={formData.guest_email}
                            onChange={(e) => setFormData({ ...formData, guest_email: e.target.value })}
                          />
                          <Input
                            placeholder="Phone Number"
                            required
                            type="tel"
                            className={cn("bg-card h-16 px-6 text-lg border-2 border-transparent focus:border-primary/50 transition-all rounded-2xl", !formData.guest_phone && "border-orange-200")}
                            value={formData.guest_phone}
                            onChange={(e) => setFormData({ ...formData, guest_phone: e.target.value })}
                          />
                        </div>
                        <Textarea
                          placeholder="Special Requests (Optional)"
                          className="bg-card p-6 text-lg border-2 border-transparent focus:border-primary/50 transition-all rounded-2xl min-h-[120px]"
                          value={formData.special_requests}
                          onChange={(e) => setFormData({ ...formData, special_requests: e.target.value })}
                        />
                      </div>
                    </section>
                  </div>

                  {/* Right Column: Pre-order Food */}
                  <div className="lg:col-span-5">
                    <section className="lg:sticky lg:top-32 space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">3</span>
                          <h2 className="text-xl font-bold tracking-widest uppercase">Pre-order Food</h2>
                        </div>
                        <div className="bg-primary/10 px-3 py-1 rounded-md">
                          <span className="text-[10px] font-bold text-primary uppercase tracking-tighter">Selected From Menu</span>
                        </div>
                      </div>

                      <div className="bg-card rounded-[2rem] p-8 space-y-8 border-2 border-border shadow-xl">
                        {/* Search */}
                        <div className="relative">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input
                            placeholder="Search more dishes to prepare..."
                            className="bg-background h-14 pl-12 border-none rounded-xl"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                          {searchQuery && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-2xl z-20 max-h-60 overflow-y-auto">
                              {filteredDishes.map(dish => (
                                <button
                                  key={dish.id}
                                  onClick={() => {
                                    handleUpdateQuantity(dish.id, 1);
                                    setSearchQuery("");
                                  }}
                                  className="w-full flex items-center justify-between p-4 hover:bg-muted transition-colors border-b last:border-none"
                                >
                                  <span className="font-bold">{dish.name}</span>
                                  <span className="text-primary font-bold">${dish.price}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Order List */}
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                          <AnimatePresence mode="popLayout">
                            {preOrder.length === 0 ? (
                              <div className="text-center py-10 text-muted-foreground italic">
                                No items selected yet.
                              </div>
                            ) : (
                              preOrder.map(item => (
                                <motion.div
                                  layout
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: 20 }}
                                  key={item.id}
                                  className="bg-background/50 p-4 rounded-xl flex items-center justify-between"
                                >
                                  <div className="space-y-1">
                                    <h4 className="font-bold text-sm leading-tight">{item.name}</h4>
                                    <p className="text-muted-foreground text-xs">${item.price} / ea</p>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-3 bg-background px-3 py-1 rounded-full border border-border">
                                      <button onClick={() => handleUpdateQuantity(item.id, -1)} className="hover:text-primary"><Minus className="w-3 h-3" /></button>
                                      <span className="font-bold text-sm min-w-4 text-center">{item.quantity}</span>
                                      <button onClick={() => handleUpdateQuantity(item.id, 1)} className="hover:text-primary"><Plus className="w-3 h-3" /></button>
                                    </div>
                                    <button onClick={() => handleRemoveItem(item.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </motion.div>
                              ))
                            )}
                          </AnimatePresence>
                        </div>

                        <div className="pt-6 border-t-2 border-dashed border-border flex items-center justify-between">
                          <span className="text-muted-foreground font-bold tracking-widest uppercase text-xs">Total to Prepare</span>
                          <span className="text-3xl font-bold text-primary">${totalToPrepare.toFixed(2)}</span>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>

                {/* Footer Button */}
                <div className="space-y-6 pt-12">
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full h-20 text-2xl font-bold bg-gradient-primary rounded-2xl shadow-glow hover:scale-[1.01] transition-transform flex items-center gap-4"
                  >
                    {isSubmitting ? "Processing..." : "Confirm Reservation"}
                    <ArrowRight className="w-6 h-6" />
                  </Button>
                  <p className="text-center text-xs font-bold text-muted-foreground tracking-widest uppercase">
                    By confirming, you agree to our 1-hour prep policy.
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--muted));
          border-radius: 10px;
        }
        input[type="date"]::-webkit-calendar-picker-indicator {
          background: transparent;
          bottom: 0;
          color: transparent;
          cursor: pointer;
          left: 0;
          position: absolute;
          right: 0;
          top: 0;
          width: auto;
        }
      `}</style>
    </>
  );
};

export default Reservations;
