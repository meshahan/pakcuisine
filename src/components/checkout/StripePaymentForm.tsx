import { useState, useEffect } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/context/CartContext";

interface StripePaymentFormProps {
    amount: number;
    metadata: {
        customerName: string;
        customerEmail: string;
        orderId?: string; // If we create the order beforehand
    };
    onSuccess: (paymentIntentId: string) => void;
    onError: (error: string) => void;
}

export default function StripePaymentForm({ amount, metadata, onSuccess, onError }: StripePaymentFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            return;
        }

        setIsLoading(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Return URL where the customer should be redirected after the PaymentIntent is confirmed.
                return_url: `${window.location.origin}/checkout/success`,
            },
            redirect: "if_required", // Prevent redirect if not 3DS
        });

        if (error) {
            if (error.type === "card_error" || error.type === "validation_error") {
                setMessage(error.message || "An unexpected error occurred.");
            } else {
                setMessage("An unexpected error occurred.");
            }
            onError(error.message || "Payment failed");
            setIsLoading(false);
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
            // Payment successful without redirect
            onSuccess(paymentIntent.id);
            setIsLoading(false);
        } else {
            // It might be 'processing' or requires action
            setIsLoading(false);
        }
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement id="payment-element" options={{ layout: "tabs" }} />

            {message && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-3 rounded text-sm">
                    {message}
                </div>
            )}

            <Button
                disabled={isLoading || !stripe || !elements}
                id="submit"
                className="w-full h-12 text-lg bg-primary hover:bg-primary/90"
            >
                <span id="button-text">
                    {isLoading ? "Processing..." : `Pay $${amount.toFixed(2)}`}
                </span>
            </Button>
        </form>
    );
}
