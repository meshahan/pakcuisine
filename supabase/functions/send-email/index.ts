
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const FORMSPREE_URL = "https://formspree.io/f/xojvplby"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const body = await req.json()
        const { type, payload, items, template } = body

        console.log(`Received request: template=${template}, type=${type}`)

        if (!payload) {
            console.error("No payload received in Edge Function")
            return new Response(JSON.stringify({ error: "Payload is missing" }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            })
        }

        const orderId = payload.id ? (typeof payload.id === 'string' ? payload.id.slice(0, 8) : payload.id) : 'NEW';
        const itemsList = items && Array.isArray(items)
            ? items.map((item: any) => `${item.quantity}x ${item.name || item.item_name}`).join(', ')
            : 'Check Admin Dashboard';

        const whatsappLink = `https://wa.me/923041845557?text=${encodeURIComponent(
            `Confirming my ${type === 'order' ? 'Order' : 'Reservation'} (#${orderId})\nItems: ${itemsList}`
        )}`

        const customerEmail = payload.customer_email || payload.guest_email || payload.email || 'no-email@example.com';
        const customerName = payload.customer_name || payload.guest_name || payload.name || 'Customer';

        if (template === 'admin_alert') {
            const submissionData = {
                _replyto: customerEmail,
                subject: `NEW ${type?.toUpperCase()} - #${orderId}`,
                message: `New ${type} from ${customerName}. Please log in to Admin Dashboard to review and send confirmation.\n\nItems: ${itemsList}`,
                customer: customerName,
                email: customerEmail,
                total: payload.total_amount ? `$${payload.total_amount}` : 'N/A',
                type: type,
                id: orderId
            }

            console.log(`Relaying admin alert to Formspree for ${customerEmail}...`)
            const response = await fetch(FORMSPREE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(submissionData)
            })

            const result = await response.json()
            if (!response.ok) throw new Error(result.error || "Failed to send to Formspree")
            return new Response(JSON.stringify(result), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 })
        }


        if (template === 'subscription_confirmation') {
            const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
            if (!RESEND_API_KEY) {
                console.error("RESEND_API_KEY is missing")
                throw new Error("RESEND_API_KEY is not set in Supabase secrets")
            }

            const subject = "Welcome to Pak Cuisine Insider Deals!";
            const htmlContent = `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h1 style="color: #333; text-align: center;">Welcome to the Club!</h1>
                    <p>Hi there,</p>
                    <p>Thanks for subscribing to Pak Cuisine's newsletter! You're now on the list to receive our:</p>
                    <ul style="color: #555;">
                        <li>🔥 Exclusive hot deals & discounts</li>
                        <li>🥘 New menu announcements</li>
                        <li>📅 Special event invitations</li>
                    </ul>
                    <p>We promise not to spam your inbox. We only send the good stuff!</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="https://pak-cuisine.com/menu" style="background: #E11D48; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Browse Menu</a>
                    </div>
                    <p style="text-align: center; color: #888; font-size: 12px;">Pak Cuisine - Authentic Flavors, Freshly Delivered</p>
                </div>
            `;

            console.log(`Sending subscription confirmation to ${customerEmail}...`)
            const res = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${RESEND_API_KEY}`
                },
                body: JSON.stringify({
                    from: 'Pak Cuisine <onboarding@resend.dev>',
                    to: ['meshahan@gmail.com'], // Restricted to verified domain/email in dev
                    subject: `[ADMIN PREVIEW] ${subject}`,
                    html: htmlContent,
                }),
            })

            const resText = await res.text()
            console.log(`Resend response (${res.status}): ${resText}`)

            if (!res.ok) {
                throw new Error("Failed to send subscription email via Resend");
            }

            return new Response(resText, {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            })
        }

        if (template === 'customer_confirmation' || template === 'customer_thanks') {
            const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
            if (!RESEND_API_KEY) {
                console.error("RESEND_API_KEY is missing")
                throw new Error("RESEND_API_KEY is not set in Supabase secrets")
            }

            let subject = "";
            let htmlContent = "";

            if (template === 'customer_confirmation') {
                subject = `Action Required: Confirm your ${type} - #${orderId}`;
                htmlContent = `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                        <h1 style="color: #333; text-align: center;">Pak Cuisine Confirmation</h1>
                        <p>Hi <strong>${customerName}</strong>,</p>
                        <p>Thank you for your ${type}. We have received your request and it is currently pending.</p>
                        <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <p style="margin: 0;"><strong>${type === 'order' ? 'Items Ordered' : 'Pre-ordered Items'}:</strong></p>
                            <p style="margin: 5px 0; color: #666;">${itemsList}</p>
                        </div>
                        <p>To finalize and confirm your ${type}, please click the button below to message us on WhatsApp:</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${whatsappLink}" style="background: #25D366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Confirm via WhatsApp</a>
                        </div>
                        <p style="text-align: center; color: #888; font-size: 12px;">Pak Cuisine - Authentic Flavors, Freshly Delivered</p>
                    </div>
                `;
            } else {
                subject = `Thank you from Pak Cuisine! - #${orderId}`;
                htmlContent = `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                        <h1 style="color: #333; text-align: center;">Order Completed!</h1>
                        <p>Hi <strong>${customerName}</strong>,</p>
                        <p>Your ${type} (#${orderId}) has been successfully completed and delivered.</p>
                        <p>We hope you had a wonderful experience and enjoyed our authentic flavors! We look forward to serving you again soon.</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="https://pak-cuisine.com" style="background: #E11D48; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Order Again</a>
                        </div>
                        <p style="text-align: center; color: #888; font-size: 12px;">Pak Cuisine - Authentic Flavors, Freshly Delivered</p>
                    </div>
                `;
            }

            console.log(`Sending manual email via Resend to admin (transitional)...`)
            const res = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${RESEND_API_KEY}`
                },
                body: JSON.stringify({
                    from: 'Pak Cuisine <onboarding@resend.dev>',
                    to: ['meshahan@gmail.com'], // Sent to admin because domain is not verified yet
                    subject: `[ADMIN PREVIEW] ${subject}`,
                    html: htmlContent,
                }),
            })

            const resText = await res.text()
            console.log(`Resend response (${res.status}): ${resText}`)

            if (!res.ok) {
                let errorMessage = "Failed to send via Resend";
                try {
                    const errorData = JSON.parse(resText);
                    errorMessage = errorData.message || errorData.error?.message || errorMessage;
                } catch (e) {
                    errorMessage = resText || errorMessage;
                }
                throw new Error(errorMessage);
            }

            return new Response(resText, {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            })
        }

        throw new Error("Invalid template specified")

    } catch (error: any) {
        console.error("Error in send-email function:", error.message)
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
