import { menuItems, restaurantInfo } from "../../lib/data";
import { supabase } from "@/integrations/supabase/client";

export interface ChatMessage {
    id: string;
    role: "user" | "assistant";
    content: string;
    type?: "text" | "menu" | "actions";
    data?: any;
    timestamp: Date;
}

export const processChatMessage = async (message: string): Promise<Partial<ChatMessage>> => {
    const query = message.toLowerCase();

    // 1. GREETINGS
    if (query.includes("hi") || query.includes("hello") || query.includes("hey") || query.includes("salam")) {
        return {
            content: "Assalamu Alaikum! Welcome to Pak Cuisine. I'm your AI assistant. I can help you find our best **deals**, check the **menu**, or **book a table** for you. How can I help today? 👋🇵🇰",
            type: "text"
        };
    }

    // 2. SEARCH LOGIC (Keyword matching for dishes/deals)
    const keywords = ["burger", "biryani", "karahi", "kebab", "broast", "dessert", "drink", "fish", "prawn", "samosa", "tikka", "lassi", "chai", "gulab jamun", "kheer", "platter", "feast", "combo"];
    const matchedKeyword = keywords.find(k => query.includes(k));

    if (matchedKeyword || query.includes("deal") || query.includes("special") || query.includes("offer") || query.includes("best")) {
        // Fetch real deals from database
        const { data: dbDeals } = await supabase
            .from('deals' as any)
            .select('*')
            .eq('is_active', true) as any;

        // Fetch top selling item from order history for social proof
        const { data: orderItems } = await supabase
            .from('order_items' as any)
            .select('item_name, quantity') as any;

        let topSellingItem = null;
        if (orderItems && orderItems.length > 0) {
            const counts: Record<string, number> = {};
            orderItems.forEach((oi: any) => {
                counts[oi.item_name] = (counts[oi.item_name] || 0) + oi.quantity;
            });
            const topItemName = Object.entries(counts).sort((a: any, b: any) => b[1] - a[1])[0]?.[0];
            topSellingItem = menuItems.find(m => m.name === topItemName);
        }

        // If specific keyword (e.g. "burger")
        if (matchedKeyword) {
            const relevantDeals = dbDeals?.filter((d: any) =>
                d.title.toLowerCase().includes(matchedKeyword) ||
                d.description?.toLowerCase().includes(matchedKeyword)
            ) || [];

            const relevantMenu = menuItems.filter(m =>
                m.name.toLowerCase().includes(matchedKeyword) ||
                m.category.toLowerCase().includes(matchedKeyword)
            );

            if (relevantDeals.length > 0 || relevantMenu.length > 0) {
                const combined = [
                    ...relevantDeals.map((d: any) => ({
                        id: d.id,
                        name: d.title,
                        description: d.description,
                        price: d.price,
                        image: d.image_url
                    })),
                    ...relevantMenu.slice(0, 3)
                ];

                return {
                    content: `I found some great options for **${matchedKeyword}**! ${relevantDeals.length > 0 ? "Check out these special deals:" : "Here is what we have on the menu:"} 😋🔥`,
                    type: "menu",
                    data: combined.slice(0, 4)
                };
            }
        }

        // General Deals/Best request
        if (query.includes("deal") || query.includes("special") || query.includes("offer") || query.includes("best")) {
            const displayDeals = dbDeals?.slice(0, 3).map((d: any) => ({
                id: d.id,
                name: d.title,
                description: d.description,
                price: d.price,
                image: d.image_url,
                original_price: d.original_price
            })) || [];

            let messageContent = "We have some amazing **deals** and specials today! 🌟👨‍🍳";
            if (topSellingItem) {
                messageContent = `Our absolute bestseller right now is the **${topSellingItem.name}**! 🔥 But you should also check out these limited-time **deals**:`;
            }

            return {
                content: messageContent,
                type: "menu",
                data: displayDeals.length > 0 ? displayDeals : menuItems.filter(m => m.isFeatured)
            };
        }
    }

    // 3. OTHER CHECKS
    // Halal check
    if (query.includes("halal")) {
        return {
            content: "Yes, 100%! All our meat is halal certified and we source only the highest quality ingredients. 🌙✨",
            type: "text"
        };
    }

    // Menu / Food general
    if (query.includes("menu") || query.includes("food") || query.includes("eat") || query.includes("dish")) {
        return {
            content: "Of course! We serve authentic Pakistani flavors. Here are some popular categories. What are you in the mood for? 🍛🍗",
            type: "menu",
            data: menuItems.filter(item => item.isFeatured).slice(0, 4)
        };
    }

    // Location
    if (query.includes("location") || query.includes("address") || query.includes("where") || query.includes("find you")) {
        return {
            content: `Visit us in the heart of the city: \n\n📍 ${restaurantInfo.address} \n\nWe'd love to host you! 🏛️`,
            type: "actions",
            data: ["Get Directions", "Book a Table"]
        };
    }

    // Timings
    if (query.includes("hours") || query.includes("time") || query.includes("timing") || query.includes("open") || query.includes("close")) {
        const hoursStr = restaurantInfo.openingHours.map(h => `${h.day}: ${h.hours}`).join("\n");
        return {
            content: `Our doors are open at these times: \n\n${hoursStr} \n\nSee you soon! ⏰`,
            type: "text"
        };
    }

    // Booking
    if (query.includes("book") || query.includes("reserve") || query.includes("reservation") || query.includes("table")) {
        return {
            content: "I'd be happy to help! You can book your table online in just a few seconds. 📅🥂",
            type: "actions",
            data: ["Book a Table"]
        };
    }

    // Default response
    return {
        content: "I'm not sure about that, but I can show you our **Menu**, latest **Deals**, or help you **Book a Table**! 😊",
        type: "actions",
        data: ["View Menu", "Top Deals", "Book a Table"]
    };
};
