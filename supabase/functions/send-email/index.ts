
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

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
        const { type, payload, items, template, config: manualConfig } = body

        console.log(`Received request: template=${template}, type=${type}`)

        if (!payload) {
            console.error("No payload received in Edge Function")
            return new Response(JSON.stringify({ error: "Payload is missing" }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            })
        }

        // Initialize Supabase Client
        const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ""
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ""
        const supabase = createClient(supabaseUrl, supabaseKey)

        // Fetch SMTP Configuration if not provided manually
        let smtpConfig = manualConfig;
        if (!smtpConfig) {
            const { data: settingsData } = await supabase
                .from('site_settings')
                .select('value')
                .eq('key', 'email')
                .single();

            if (settingsData?.value) {
                smtpConfig = settingsData.value;
            }
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

        // Prepare Email Content based on template
        let subject = "";
        let htmlContent = "";

        if (template === 'subscription_confirmation' || type === 'test') {
            subject = type === 'test' ? "SMTP Connection Test" : "Welcome to Pak Cuisine Insider Deals!";
            htmlContent = `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h1 style="color: #333; text-align: center;">${type === 'test' ? 'It Works!' : 'Welcome to the Club!'}</h1>
                    <p>Hi ${customerName},</p>
                    <p>${type === 'test'
                    ? 'This is a test email to confirm your SMTP configuration is working correctly.'
                    : 'Thanks for subscribing to Pak Cuisine newsletter! You\'re now on the list for exclusive deals.'}</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="https://pak-cuisine.com" style="background: #E11D48; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Visit Our Website</a>
                    </div>
                </div>
            `;
        } else if (template === 'customer_confirmation') {
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
        } else if (template === 'customer_thanks') {
            subject = `Thank you from Pak Cuisine! - #${orderId}`;
            htmlContent = `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h1 style="color: #333; text-align: center;">Order Completed!</h1>
                    <p>Hi <strong>${customerName}</strong>,</p>
                    <p>Your ${type} (#${orderId}) has been successfully completed and delivered.</p>
                    <p>Enjoy our authentic flavors! We look forward to serving you again soon.</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="https://pak-cuisine.com" style="background: #E11D48; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Order Again</a>
                    </div>
                </div>
            `;
        }

        // 1. Try Custom SMTP if configured
        if (smtpConfig?.smtpHost && smtpConfig?.smtpUser && smtpConfig?.smtpPass) {
            try {
                console.log(`Attempting to send email via SMTP (${smtpConfig.smtpHost}) to ${customerEmail}...`)
                const client = new SmtpClient();
                await client.connectTLS({
                    hostname: smtpConfig.smtpHost,
                    port: parseInt(smtpConfig.smtpPort || "587"),
                    username: smtpConfig.smtpUser,
                    password: smtpConfig.smtpPass,
                });

                await client.send({
                    from: `${smtpConfig.senderName || 'Pak Cuisine'} <${smtpConfig.smtpUser}>`,
                    to: customerEmail,
                    subject: subject,
                    content: htmlContent,
                    html: htmlContent,
                });

                await client.close();
                console.log(`Email sent successfully via SMTP to ${customerEmail}`);

                return new Response(JSON.stringify({ success: true, method: 'smtp' }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 200,
                })
            } catch (smtpError) {
                console.error("SMTP Error:", smtpError.message);
                // If it's a test, return the error
                if (type === 'test') {
                    throw smtpError;
                }
                // Otherwise fallback (silent failure of SMTP, continue to fallback)
            }
        }

        // 2. Fallback to Formspree for Admin Alerts OR if SMTP failed/missing
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

        // 3. Fallback to Resend if configured and SMTP failed/missing
        const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
        if (RESEND_API_KEY) {
            console.log(`Fallback: Sending email via Resend to ${customerEmail}...`)
            const res = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${RESEND_API_KEY}`
                },
                body: JSON.stringify({
                    from: 'Pak Cuisine <onboarding@resend.dev>',
                    to: ['meshahan@gmail.com'], // Still restricted to meshahan@gmail.com for Resend free tier/unverified
                    subject: `[FALLBACK] ${subject}`,
                    html: htmlContent,
                }),
            })

            if (res.ok) {
                return new Response(await res.text(), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 200,
                })
            }
        }

        throw new Error("No valid email configuration (SMTP or Resend) found or all failed.")

    } catch (error: any) {
        console.error("Error in send-email function:", error.message)
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
