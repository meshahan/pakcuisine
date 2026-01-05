import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export function AdminContacts() {
  const [contacts, setContacts] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setContacts(data);
    });
  }, []);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-foreground mb-8">Contact Messages</h1>
      <div className="space-y-4">
        {contacts.map((c) => (
          <div key={c.id} className="bg-card rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-semibold text-foreground">{c.name}</p>
                <p className="text-sm text-muted-foreground">{c.email}</p>
              </div>
              <span className="text-xs text-muted-foreground">{format(new Date(c.created_at), "MMM d, yyyy")}</span>
            </div>
            {c.subject && <p className="font-medium text-foreground mb-2">{c.subject}</p>}
            <p className="text-muted-foreground">{c.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
