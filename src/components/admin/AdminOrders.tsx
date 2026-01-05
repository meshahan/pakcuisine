import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Clock, CheckCircle, Truck, XCircle, Search, History, Timer, Sparkles, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface OrderItem {
    id: string;
    item_name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
}

interface Order {
    id: string;
    customer_name: string;
    customer_phone: string;
    customer_email: string;
    delivery_address: string;
    order_type: string;
    payment_method: string;
    payment_status: string;
    order_status: string;
    total_amount: number;
    special_instructions: string;
    created_at: string;
    order_items: OrderItem[];
}

export default function AdminOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const { toast } = useToast();

    useEffect(() => {
        fetchOrders();

        // Realtime subscription
        const channel = supabase
            .channel('schema-db-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'orders',
                },
                () => {
                    fetchOrders();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchOrders = async () => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select(`
          *,
          order_items (*)
        `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setOrders(data || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const sendManualEmail = (order: any, template: 'customer_confirmation' | 'customer_thanks') => {
        const customerEmail = order.customer_email || order.email || '';
        const customerName = order.customer_name || 'Customer';
        const orderId = order.id.slice(0, 8);
        const itemsList = order.order_items?.map((item: any) => `${item.quantity}x ${item.menu_items?.name}`).join(', ') || 'your order';

        let subject = "";
        let body = "";

        if (template === 'customer_confirmation') {
            subject = `Confirm your Order #${orderId} - Pak Cuisine`;
            const whatsappLink = `https://wa.me/923041845557?text=${encodeURIComponent(`Confirming my Order (#${orderId})`)}`;
            body = `Hi ${customerName},\n\nThank you for your order (#${orderId}).\n\nItems: ${itemsList}\n\nTo finalize and confirm your order, please message us on WhatsApp here: ${whatsappLink}\n\nPak Cuisine - Authentic Flavors, Freshly Delivered`;
        } else {
            subject = `Your Order #${orderId} is Complete! - Pak Cuisine`;
            body = `Hi ${customerName},\n\nYour order (#${orderId}) has been successfully completed and delivered.\n\nWe hope you enjoyed our authentic flavors! We look forward to serving you again soon.\n\nOrder again at: https://pak-cuisine.com\n\nPak Cuisine - Authentic Flavors, Freshly Delivered`;
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
                .from('orders')
                .update({ order_status: newStatus })
                .eq('id', id);

            if (error) throw error;

            toast({
                title: "Status Updated",
                description: `Order marked as ${newStatus.replace('_', ' ')}`,
            });

            fetchOrders();
        } catch (error) {
            toast({
                title: "Update Failed",
                variant: "destructive",
            });
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/50';
            case 'confirmed': return 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/50';
            case 'reparing': return 'bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-500/50';
            case 'out_for_delivery': return 'bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/50';
            case 'delivered': return 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/50';
            case 'cancelled': return 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/50';
            default: return 'bg-gray-500/20 text-gray-600 dark:text-gray-400 border-gray-500/50';
        }
    };

    const activeOrders = orders.filter(o =>
        ['pending', 'confirmed', 'preparing', 'out_for_delivery'].includes(o.order_status) &&
        (o.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) || o.id.includes(searchQuery))
    );

    const historyOrders = orders.filter(o =>
        ['delivered', 'cancelled'].includes(o.order_status) &&
        (o.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) || o.id.includes(searchQuery))
    );

    const OrderList = ({ data }: { data: Order[] }) => (
        <div className="grid gap-4">
            {data.length === 0 && !loading ? (
                <Card className="p-8 text-center text-muted-foreground border-dashed">
                    <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No orders in this list.</p>
                </Card>
            ) : (
                data.map((order) => (
                    <Card key={order.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <div className="flex flex-col md:flex-row justify-between p-6 gap-6">
                            {/* Order Info */}
                            <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-3">
                                    <Badge variant="outline" className={`capitalize border ${getStatusColor(order.order_status)}`}>
                                        {order.order_status.replace('_', ' ')}
                                    </Badge>
                                    <span className="text-sm text-muted-foreground">{new Date(order.created_at).toLocaleString()}</span>
                                </div>
                                <h3 className="font-bold text-lg">{order.customer_name}</h3>
                                <div className="text-sm text-muted-foreground space-y-1">
                                    <p>{order.customer_phone}</p>
                                    <p className="line-clamp-1">{order.delivery_address}</p>
                                </div>
                                {order.special_instructions && (
                                    <div className="bg-yellow-500/10 text-yellow-600 p-2 rounded text-xs mt-2 border border-yellow-200 dark:border-yellow-900 inline-block">
                                        Note: {order.special_instructions}
                                    </div>
                                )}
                            </div>

                            {/* Items Summary */}
                            <div className="flex-1 border-l border-border pl-0 md:pl-6">
                                <div className="space-y-1 mb-2">
                                    {order.order_items.map((item) => (
                                        <div key={item.id} className="flex justify-between text-sm">
                                            <span><span className="font-semibold">{item.quantity}x</span> {item.item_name}</span>
                                            <span className="text-muted-foreground">${item.total_price.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t border-border pt-2 flex justify-between font-bold">
                                    <span>Total</span>
                                    <span className="text-primary">${order.total_amount.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 md:w-48 justify-end">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="sm">Details</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Order Details #{order.id.slice(0, 8)}</DialogTitle>
                                        </DialogHeader>
                                        <ScrollArea className="max-h-[80vh]">
                                            <div className="space-y-6 p-1">
                                                {/* Customer Info */}
                                                <div>
                                                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                                                        <Truck className="w-4 h-4" /> Customer Information
                                                    </h4>
                                                    <div className="bg-muted p-3 rounded-lg text-sm space-y-1">
                                                        <p><span className="font-medium">Name:</span> {order.customer_name}</p>
                                                        <p><span className="font-medium">Phone:</span> {order.customer_phone}</p>
                                                        <p><span className="font-medium">Email:</span> {order.customer_email || 'N/A'}</p>
                                                        <p><span className="font-medium">Address:</span> {order.delivery_address}</p>
                                                    </div>
                                                </div>

                                                {/* Communication Controls */}
                                                <div>
                                                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                                                        <ShoppingBag className="w-4 h-4" /> Customer Communication
                                                    </h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="default"
                                                            className="bg-primary hover:bg-primary/90"
                                                            onClick={() => sendManualEmail(order, 'customer_confirmation')}
                                                        >
                                                            📧 Send Confirmation Link
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="secondary"
                                                            onClick={() => sendManualEmail(order, 'customer_thanks')}
                                                        >
                                                            🙏 Send Thank You
                                                        </Button>
                                                    </div>
                                                </div>

                                                {/* Order Status Control */}
                                                <div>
                                                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                                                        <Clock className="w-4 h-4" /> Update Status
                                                    </h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {[
                                                            { label: 'Pending', value: 'pending', color: 'bg-yellow-500 text-white' },
                                                            { label: 'Confirmed', value: 'confirmed', color: 'bg-blue-500 text-white' },
                                                            { label: 'Cook', value: 'preparing', color: 'bg-orange-500 text-white' },
                                                            { label: 'Ship', value: 'out_for_delivery', color: 'bg-purple-500 text-white' },
                                                            { label: 'Done', value: 'delivered', color: 'bg-green-600 text-white' },
                                                            { label: 'Cancel', value: 'cancelled', color: 'bg-red-500 text-white' },
                                                        ].map((status) => (
                                                            <Button
                                                                key={status.value}
                                                                size="sm"
                                                                variant={order.order_status === status.value ? "default" : "outline"}
                                                                onClick={() => updateStatus(order.id, status.value)}
                                                                className={order.order_status === status.value ? status.color : ""}
                                                            >
                                                                {status.label}
                                                            </Button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </ScrollArea>
                                    </DialogContent>
                                </Dialog>

                                {/* Quick Actions */}
                                {order.order_status === 'pending' && (
                                    <Button size="sm" onClick={() => updateStatus(order.id, 'confirmed')}>
                                        Accept
                                    </Button>
                                )}
                                {order.order_status === 'confirmed' && (
                                    <Button size="sm" onClick={() => updateStatus(order.id, 'preparing')}>
                                        Cook
                                    </Button>
                                )}
                                {order.order_status === 'preparing' && (
                                    <Button size="sm" onClick={() => updateStatus(order.id, 'out_for_delivery')}>
                                        Dispatch
                                    </Button>
                                )}

                                {/* Quick Notify Buttons */}
                                <div className="flex gap-1">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 text-primary border-primary/20"
                                        title="Send Confirmation Link"
                                        onClick={() => sendManualEmail(order, 'customer_confirmation')}
                                    >
                                        <CheckCircle className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 text-green-600 border-green-200"
                                        title="Send Thank You"
                                        onClick={() => sendManualEmail(order, 'customer_thanks')}
                                    >
                                        <Sparkles className="h-4 w-4 text-yellow-500" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))
            )}
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-display font-bold text-gradient-primary">
                        Orders Management
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        Track and manage incoming food orders
                    </p>
                </div>

                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search orders..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <Tabs defaultValue="active" className="w-full">
                <TabsList className="grid w-full max-w-[400px] grid-cols-2 mb-6">
                    <TabsTrigger value="active" className="flex items-center gap-2">
                        <Timer className="w-4 h-4" /> Active ({activeOrders.length})
                    </TabsTrigger>
                    <TabsTrigger value="history" className="flex items-center gap-2">
                        <History className="w-4 h-4" /> History ({historyOrders.length})
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="active">
                    <OrderList data={activeOrders} />
                </TabsContent>
                <TabsContent value="history">
                    <OrderList data={historyOrders} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
