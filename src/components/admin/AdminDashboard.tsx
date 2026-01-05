import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, MessageSquare, UtensilsCrossed, Users } from "lucide-react";

export function AdminDashboard() {
  const [stats, setStats] = useState({ reservations: 0, contacts: 0, menuItems: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const [reservations, contacts, menuItems] = await Promise.all([
        supabase.from("reservations").select("id", { count: "exact", head: true }),
        supabase.from("contact_submissions").select("id", { count: "exact", head: true }),
        supabase.from("menu_items").select("id", { count: "exact", head: true }),
      ]);
      setStats({
        reservations: reservations.count || 0,
        contacts: contacts.count || 0,
        menuItems: menuItems.count || 0,
      });
    };
    fetchStats();
  }, []);

  const cards = [
    { title: "Reservations", value: stats.reservations, icon: Calendar, color: "bg-primary" },
    { title: "Messages", value: stats.contacts, icon: MessageSquare, color: "bg-secondary" },
    { title: "Menu Items", value: stats.menuItems, icon: UtensilsCrossed, color: "bg-accent" },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-foreground mb-8">Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div key={card.title} className="bg-card rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center`}>
                <card.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">{card.value}</p>
                <p className="text-muted-foreground">{card.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
