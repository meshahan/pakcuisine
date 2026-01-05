import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Truck, CreditCard, CheckCircle, Loader2 } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripePaymentForm from "@/components/checkout/StripePaymentForm";
import { cn } from "@/lib/utils";

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "");

export default function Checkout() {
    const navigate = useNavigate();
    const { items, cartTotal, clearCart } = useCart();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [clientSecret, setClientSecret] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        instructions: "",
        paymentMethod: "cod",
    });

    // Fetch PaymentIntent when payment method changes to 'card'
    useEffect(() => {
        if (formData.paymentMethod === 'card' && !clientSecret && cartTotal > 0) {
            if (!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
                toast({
                    title: "Configuration Error",
                    description: "Stripe Publishable Key is missing. Please check your .env file.",
                    variant: "destructive"
                });
                return;
            }

            const createPaymentIntent = async () => {
                try {
                    const { data, error } = await supabase.functions.invoke('payment', {
                        body: { amount: cartTotal, email: formData.email }
                    });

                    if (error) {
                        console.error("Supabase Function Error:", error);
                        throw new Error(error.message || "Failed to contact payment server");
                    }

                    if (data?.clientSecret) {
                        setClientSecret(data.clientSecret);
                    } else {
                        throw new Error("No client secret returned");
                    }
                } catch (error: any) {
                    console.error("Detailed Payment Error:", error);
                    let userMessage = "Could not set up secure payment.";

                    if (error.message?.includes("FunctionsFetchError")) {
                        userMessage = "Payment service is offline. Please deploy Supabase functions.";
                    } else if (error.message?.includes("Integration not found")) {
                        userMessage = "Payment function not found on server.";
                    }

                    toast({
                        title: "Payment Initialization Failed",
                        description: `${userMessage} Please try COD.`,
                        variant: "destructive"
                    });
                }
            };

            const timer = setTimeout(() => {
                if (cartTotal > 0) createPaymentIntent();
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [formData.paymentMethod, cartTotal, clientSecret, formData.email]);

    const placeOrder = async (TransactionId = "") => {
        setLoading(true);
        try {
            // 1. Create Order in Supabase
            const { data: order, error: orderError } = await supabase
                .from("orders")
                .insert({
                    customer_name: formData.name,
                    customer_email: formData.email,
                    customer_phone: formData.phone,
                    delivery_address: formData.address,
                    payment_method: formData.paymentMethod,
                    payment_status: TransactionId ? "paid" : "pending",
                    total_amount: cartTotal,
                    special_instructions: formData.instructions,
                })
                .select()
                .single();

            if (orderError) {
                console.error("Database error creating order:", orderError);
                throw orderError;
            }

            if (!order) {
                console.error("Order created but no data returned. Check RLS policies.");
                throw new Error("Order submitted but could not be verified by the local browser. Please contact us if you don't receive an email.");
            }

            console.log("Order created successfully:", order);

            // 2. Create Order Items in Supabase
            // ... (rest of the items logic)
            const orderItems = items.map(item => ({
                order_id: order.id,
                item_name: item.name,
                quantity: item.quantity,
                unit_price: item.price,
                total_price: item.price * item.quantity
            }));

            const { error: itemsError } = await supabase
                .from("order_items")
                .insert(orderItems);

            if (itemsError) {
                console.error("Error creating order items:", itemsError);
                throw itemsError;
            }

            // 3. Send Transactional Email (Admin + Customer notification via Formspree)
            // 3. Send Transactional Email (Admin + Customer notification via Formspree)
            console.log("Invoking email function for order:", order.id);

            // DEFENSIVE: Create a robust payload using both DB data and form data
            const emailPayload = {
                ...order,
                customer_name: order.customer_name || formData.name,
                customer_email: order.customer_email || formData.email,
                customer_phone: order.customer_phone || formData.phone,
                delivery_address: order.delivery_address || formData.address,
                total_amount: order.total_amount || totalAmount,
                payment_method: order.payment_method || paymentMethod,
            };

            const { data: emailResult, error: emailError } = await supabase.functions.invoke('send-email', {
                body: {
                    type: 'order',
                    template: 'admin_alert',
                    payload: emailPayload,
                    items: items // Include the actual items from the cart
                }
            });

            if (emailError) {
                console.error("Confirmation system error:", emailError);
            } else {
                console.log("Email function result:", emailResult);
            }

            // Success
            setSuccess(true);
            clearCart();
            toast({
                title: "Order Placed Successfully!",
                description: "We'll start preparing your food right away.",
            });

        } catch (error: any) {
            toast({
                title: "Order Failed",
                description: error.message || "Something went wrong. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.address.trim()) {
            toast({
                title: "Missing Information",
                description: "Please fill in all required fields (Name, Email, Phone, and Address).",
                variant: "destructive",
            });
            return false;
        }
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast({
                title: "Invalid Email",
                description: "Please enter a valid email address.",
                variant: "destructive",
            });
            return false;
        }
        return true;
    };

    const handleCodSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (items.length === 0) return;
        if (!validateForm()) return;
        placeOrder();
    };

    if (success) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-muted text-center">
                <div className="w-24 h-24 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                </div>
                <h1 className="text-3xl font-display font-bold mb-2">Order Confirmed!</h1>
                <p className="text-muted-foreground mb-8 max-w-md">
                    Thank you for your order, <strong>{formData.name}</strong>. We have received it and will begin preparation shortly.
                </p>
                <Button onClick={() => navigate("/menu")} className="min-w-[200px]">
                    Order More Food
                </Button>
            </div>
        );
    }

    // If cart is empty and not success state, redirect to menu
    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                <Button onClick={() => navigate("/menu")}>Return to Menu</Button>
            </div>
        );
    }

    const stripeOptions = {
        clientSecret,
        appearance: {
            theme: 'stripe',
            variables: {
                colorPrimary: '#F97316',
            },
        } as any,
    };

    return (
        <>
            <Helmet>
                <title>Checkout - Pak Cuisine</title>
            </Helmet>

            <Navbar />

            <main className="pt-24 min-h-screen bg-muted/30 pb-20">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-display font-bold mb-8">Checkout</h1>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">

                                {/* Contact Info */}
                                <div className="space-y-4">
                                    <h2 className="text-xl font-semibold flex items-center gap-2">
                                        <Truck className="w-5 h-5 text-primary" /> Delivery Details
                                    </h2>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Full Name</Label>
                                            <Input
                                                id="name"
                                                required
                                                placeholder="John Doe"
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                className={cn(!formData.name && "border-orange-200 focus:border-primary")}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <Input
                                                id="phone"
                                                required
                                                type="tel"
                                                placeholder="(123) 456-7890"
                                                value={formData.phone}
                                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                className={cn(!formData.phone && "border-orange-200 focus:border-primary")}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input
                                            id="email"
                                            required
                                            type="email"
                                            placeholder="john@example.com"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            className={cn(!formData.email && "border-orange-200 focus:border-primary")}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="address">Delivery Address</Label>
                                        <Textarea
                                            id="address"
                                            required
                                            placeholder="123 Street Name, Building, Apartment..."
                                            className={cn("min-h-[100px]", !formData.address && "border-orange-200 focus:border-primary")}
                                            value={formData.address}
                                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="instructions">Special Instructions (Optional)</Label>
                                        <Input
                                            id="instructions"
                                            placeholder="e.g., Leave at door, extra spicy..."
                                            value={formData.instructions}
                                            onChange={e => setFormData({ ...formData, instructions: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <Separator />

                                {/* Payment */}
                                <div className="space-y-4">
                                    <h2 className="text-xl font-semibold flex items-center gap-2">
                                        <CreditCard className="w-5 h-5 text-primary" /> Payment Method
                                    </h2>
                                    <RadioGroup
                                        defaultValue="cod"
                                        value={formData.paymentMethod}
                                        onValueChange={val => setFormData({ ...formData, paymentMethod: val })}
                                    >
                                        <div className="flex items-center space-x-2 border border-border p-4 rounded-lg bg-secondary/20 has-[:checked]:border-primary w-full">
                                            <RadioGroupItem value="cod" id="cod" />
                                            <Label htmlFor="cod" className="font-medium cursor-pointer flex-1">Cash on Delivery (COD)</Label>
                                        </div>
                                        <div className="flex items-center space-x-2 border border-border p-4 rounded-lg bg-secondary/20 has-[:checked]:border-primary w-full">
                                            <RadioGroupItem value="card" id="card" />
                                            <Label htmlFor="card" className="font-medium cursor-pointer flex-1">Credit / Debit Card</Label>
                                        </div>
                                    </RadioGroup>

                                    {formData.paymentMethod === 'cod' && (
                                        <div className="animate-fade-in text-sm text-muted-foreground p-2">
                                            Pay with cash when your food arrives.
                                        </div>
                                    )}

                                    {formData.paymentMethod === 'card' && (
                                        <div className="pt-4 animate-fade-in min-h-[150px]">
                                            {clientSecret ? (
                                                <div className="space-y-4">
                                                    {!formData.name || !formData.email || !formData.phone || !formData.address ? (
                                                        <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg text-orange-800 text-sm">
                                                            ⚠️ Please fill in all delivery details above to enable card payment.
                                                        </div>
                                                    ) : (
                                                        <Elements stripe={stripePromise} options={stripeOptions}>
                                                            <StripePaymentForm
                                                                amount={cartTotal}
                                                                metadata={{
                                                                    customerName: formData.name,
                                                                    customerEmail: formData.email
                                                                }}
                                                                onSuccess={(id) => placeOrder(id)}
                                                                onError={(err) => console.error(err)}
                                                            />
                                                        </Elements>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center p-8 text-muted-foreground gap-2">
                                                    <Loader2 className="w-6 h-6 animate-spin" />
                                                    <p>Loading Secure Payment...</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {formData.paymentMethod === 'cod' && (
                                    <Button
                                        onClick={handleCodSubmit}
                                        className="w-full h-12 text-lg bg-primary hover:bg-primary/90 mt-4"
                                        disabled={loading}
                                    >
                                        {loading ? "Processing Order..." : `Place Order - $${cartTotal.toFixed(2)}`}
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-card border border-border rounded-xl p-6 shadow-sm sticky top-24">
                                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                    <ShoppingCart className="w-5 h-5" /> Your Order
                                </h2>

                                <div className="space-y-4 mb-6">
                                    {items.map(item => (
                                        <div key={item.id} className="flex justify-between items-start text-sm">
                                            <div className="flex gap-2">
                                                <span className="font-bold text-primary">{item.quantity}x</span>
                                                <span>{item.name}</span>
                                            </div>
                                            <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>

                                <Separator className="mb-4" />

                                <div className="space-y-2">
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Subtotal</span>
                                        <span>${cartTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Delivery Fee</span>
                                        <span>Free</span>
                                    </div>
                                    <Separator className="my-2" />
                                    <div className="flex justify-between font-bold text-xl">
                                        <span>Total</span>
                                        <span className="text-primary">${cartTotal.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
