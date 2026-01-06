
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

        // Fetch SMTP and Admin Settings
        const { data: allSettings } = await supabase
            .from('site_settings')
            .select('*');

        const settingsMap: any = {};
        allSettings?.forEach(s => settingsMap[s.key] = s.value);

        let smtpConfig = manualConfig || settingsMap['email'];
        const adminNotificationEmail = settingsMap['contact']?.admin_email || 'meshahan@gmail.com';

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
        } else if (template === 'admin_alert') {
            subject = `NEW ${type?.toUpperCase()} - #${orderId}`;
            htmlContent = `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h1 style="color: #333; text-align: center;">New ${type?.toUpperCase()}!</h1>
                    <p>You have received a new ${type} from <strong>${customerName}</strong>.</p>
                    <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p><strong>ID:</strong> #${orderId}</p>
                        <p><strong>Customer:</strong> ${customerName}</p>
                        <p><strong>Email:</strong> ${customerEmail}</p>
                        <p><strong>Items:</strong> ${itemsList}</p>
                    </div>
                    <p>Please log in to the Admin Dashboard to review more details.</p>
                </div>
            `;
        }

        // 1. Try Custom SMTP if configured
        if (smtpConfig?.smtpHost && smtpConfig?.smtpUser && smtpConfig?.smtpPass) {
            try {
                const targetEmail = template === 'admin_alert' ? adminNotificationEmail : customerEmail;
                console.log(`Attempting to send email via SMTP (${smtpConfig.smtpHost}) to ${targetEmail}...`)

                const client = new SmtpClient();
                await client.connectTLS({
                    hostname: smtpConfig.smtpHost,
                    port: parseInt(smtpConfig.smtpPort || "587"),
                    username: smtpConfig.smtpUser,
                    password: smtpConfig.smtpPass,
                });

                await client.send({
                    from: `${smtpConfig.senderName || 'Pak Cuisine'} <${smtpConfig.smtpUser}>`,
                    to: targetEmail,
                    subject: subject,
                    content: htmlContent,
                    html: htmlContent,
                });

                await client.close();
                console.log(`Email sent successfully via SMTP to ${targetEmail}`);

                return new Response(JSON.stringify({ success: true, method: 'smtp', recipient: targetEmail }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 200,
                })
            } catch (smtpError) {
                console.error("SMTP Error:", smtpError.message);
                if (type === 'test') throw smtpError;
            }
        }

        // 2. Fallback to Resend
        const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
        if (RESEND_API_KEY) {
            const targetEmail = template === 'admin_alert' ? adminNotificationEmail : customerEmail;
            console.log(`Fallback: Sending email via Resend to ${targetEmail}...`)
            const res = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${RESEND_API_KEY}`
                },
                body: JSON.stringify({
                    from: 'Pak Cuisine <onboarding@resend.dev>',
                    to: [targetEmail],
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
