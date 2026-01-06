import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CalendarClock, History, Mail, Eye, Users, UtensilsCrossed } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export function AdminReservations() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRes, setSelectedRes] = useState<any | null>(null);
  const { toast } = useToast();

  const fetchReservations = async () => {
    const { data } = await supabase
      .from("reservations")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setReservations(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const sendManualEmail = (res: any, template: 'customer_confirmation' | 'customer_thanks') => {
    const customerEmail = res.guest_email || res.email || '';
    const customerName = res.guest_name || 'Guest';
    const resDate = format(new Date(res.reservation_date), "MMM d, yyyy");
    const resTime = res.reservation_time;

    let subject = "";
    let body = "";

    if (template === 'customer_confirmation') {
      subject = `Confirmation for your Table Reservation - Pak Cuisine`;
      const whatsappLink = `https://wa.me/923041845557?text=${encodeURIComponent(`Confirming my Reservation on ${resDate} at ${resTime}`)}`;
      body = `Hi ${customerName},\n\nWe have received your reservation request for ${resDate} at ${resTime}.\n\nTo finalize and confirm your booking, please message us on WhatsApp here: ${whatsappLink}\n\nPak Cuisine - Authentic Flavors, Freshly Delivered`;
    } else {
      subject = `Thank you for visiting Pak Cuisine!`;
      body = `Hi ${customerName},\n\nThank you for choosing Pak Cuisine for your reservation on ${resDate}.\n\nWe hope you had a wonderful dining experience! We look forward to seeing you again soon.\n\nReserve again at: https://pak-cuisine.com/reservations\n\nPak Cuisine - Authentic Flavors, Freshly Delivered`;
    }

    const mailtoUrl = `mailto:${customerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;

    toast({
      title: "Email Client Opened",
      description: `Drafting ${template === 'customer_confirmation' ? 'confirmation' : 'thank you'} email for ${customerName}`,
    });
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("reservations")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Reservation marked as ${newStatus}`,
      });

      fetchReservations();
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Could not update status",
        variant: "destructive",
      });
    }
  };

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500/20 text-yellow-600 border-yellow-200",
    confirmed: "bg-green-500/20 text-green-600 border-green-200",
    cancelled: "bg-red-500/20 text-red-600 border-red-200",
    completed: "bg-gray-500/20 text-gray-600 border-gray-200",
  };

  const activeReservations = reservations.filter(r => ['pending', 'confirmed'].includes(r.status));
  const historyReservations = reservations.filter(r => ['completed', 'cancelled'].includes(r.status));

  const ReservationTable = ({ data }: { data: any[] }) => (
    <div className="bg-card rounded-xl shadow-sm overflow-hidden border border-border">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
            <tr>
              <th className="px-6 py-4 font-semibold">Guest Details</th>
              <th className="px-6 py-4 font-semibold">Date & Time</th>
              <th className="px-6 py-4 font-semibold">Party</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                  No reservations found.
                </td>
              </tr>
            ) : (
              data.map((r) => (
                <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-foreground">{r.guest_name}</p>
                    <p className="text-muted-foreground text-xs">{r.guest_email}</p>
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {format(new Date(r.reservation_date), "MMM d, yyyy")}
                    <span className="block text-xs text-muted-foreground">{r.reservation_time}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <span className="inline-flex items-center gap-1 font-medium">
                        {r.party_size} people
                      </span>
                      {r.pre_order && Array.isArray(r.pre_order) && r.pre_order.length > 0 && (
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-[10px] py-0 h-4 flex items-center gap-1 w-fit">
                          <UtensilsCrossed className="w-2.5 h-2.5" />
                          Food Pre-ordered
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className={`capitalize ${statusColors[r.status]}`}>
                      {r.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 text-blue-600 border-blue-200"
                        title="View Details"
                        onClick={() => setSelectedRes(r)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 text-primary border-primary/20"
                        title="Send Confirmation Link"
                        onClick={() => sendManualEmail(r, 'customer_confirmation')}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 text-green-600 border-green-200"
                        title="Send Thank You"
                        onClick={() => sendManualEmail(r, 'customer_thanks')}
                      >
                        <History className="h-4 w-4 text-yellow-500" />
                      </Button>
                      <Select defaultValue={r.status} onValueChange={(val) => updateStatus(r.id, val)}>
                        <SelectTrigger className="w-[120px] h-8 text-xs">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-gradient-primary">Reservations</h1>
          <p className="text-muted-foreground">Manage table bookings and guest requests</p>
        </div>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full max-w-[400px] grid-cols-2 mb-4">
            <TabsTrigger value="active" className="flex items-center gap-2">
              <CalendarClock className="w-4 h-4" /> Active ({activeReservations.length})
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="w-4 h-4" /> History ({historyReservations.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-0">
            <ReservationTable data={activeReservations} />
          </TabsContent>

          <TabsContent value="history" className="mt-0">
            <ReservationTable data={historyReservations} />
          </TabsContent>
        </Tabs>
      )}

      <Dialog open={!!selectedRes} onOpenChange={(open) => !open && setSelectedRes(null)}>
        <DialogContent className="max-w-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <CalendarClock className="w-6 h-6 text-primary" />
              Reservation Details
            </DialogTitle>
            <DialogDescription>
              Full briefing for reservation from {selectedRes?.guest_name}
            </DialogDescription>
          </DialogHeader>

          {selectedRes && (
            <div className="space-y-6 pt-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-widest mb-1">Guest Info</h4>
                    <p className="font-bold text-foreground text-lg">{selectedRes.guest_name}</p>
                    <p className="text-sm text-muted-foreground">{selectedRes.guest_email}</p>
                    <p className="text-sm text-muted-foreground">{selectedRes.guest_phone || "No phone provided"}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-widest mb-1">Booking Info</h4>
                    <p className="text-sm">
                      <span className="font-bold">Date:</span> {format(new Date(selectedRes.reservation_date), "EEEE, MMMM d, yyyy")}
                    </p>
                    <p className="text-sm">
                      <span className="font-bold">Time:</span> {selectedRes.reservation_time}
                    </p>
                    <p className="text-sm flex items-center gap-1">
                      <span className="font-bold">Party:</span> {selectedRes.party_size} people <Users className="w-3 h-3" />
                    </p>
                  </div>
                </div>

                <div className="bg-muted/30 p-4 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Special Requests</h4>
                  <p className="text-sm italic leading-relaxed">
                    {selectedRes.special_requests || "No special requests."}
                  </p>
                </div>
              </div>

              {selectedRes.pre_order && Array.isArray(selectedRes.pre_order) && selectedRes.pre_order.length > 0 && (
                <div className="border-t border-border pt-6">
                  <h4 className="text-xs font-bold uppercase text-primary tracking-widest mb-4">Pre-ordered Food</h4>
                  <div className="bg-background/50 rounded-xl overflow-hidden border border-border">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-muted/50 text-xs text-muted-foreground">
                        <tr>
                          <th className="px-4 py-3">Item</th>
                          <th className="px-4 py-3 text-center">Qty</th>
                          <th className="px-4 py-3 text-right">Price</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {selectedRes.pre_order.map((item: any, idx: number) => (
                          <tr key={idx}>
                            <td className="px-4 py-3 font-medium">{item.name}</td>
                            <td className="px-4 py-3 text-center">{item.quantity}</td>
                            <td className="px-4 py-3 text-right">${(item.price * item.quantity).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-muted/30 font-bold">
                          <td colSpan={2} className="px-4 py-3 text-right uppercase tracking-tighter text-xs">Total to Prepare</td>
                          <td className="px-4 py-3 text-right text-primary text-base">
                            ${selectedRes.pre_order.reduce((acc: number, i: any) => acc + (i.price * i.quantity), 0).toFixed(2)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-4">
                <Button onClick={() => setSelectedRes(null)}>Close Details</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
