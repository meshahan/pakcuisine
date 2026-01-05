
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@12.0.0?target=deno'

console.log("Stripe Payment Function Initialized")

serve(async (req) => {
    // 1. Handle CORS immediately
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    }

    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // 2. Setup Stripe inside try block to catch init errors
        const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
        if (!stripeKey) {
            throw new Error('Missing STRIPE_SECRET_KEY in Environment Variables');
        }

        const stripe = new Stripe(stripeKey, {
            apiVersion: '2022-11-15', // Use a stable API version
            httpClient: Stripe.createFetchHttpClient(),
        })

        // 3. Get Request Body
        const { amount, email } = await req.json()

        if (!amount || amount <= 0) {
            throw new Error('Invalid amount');
        }

        // 4. Create PaymentIntent
        // transform amount to cents (e.g. 10.00 -> 1000)
        const amountInCents = Math.round(amount * 100);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: 'usd',
            automatic_payment_methods: { enabled: true },
            receipt_email: email,
        })

        // 5. Return Client Secret
        return new Response(
            JSON.stringify({ clientSecret: paymentIntent.client_secret }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            },
        )
    } catch (error) {
        console.error("Payment Function Error:", error);
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            },
        )
    }
})
