import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit, Save, X, Tag } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ImageUploader } from "./ImageUploader";

// ... (existing imports)

// ... (inside component)

// ... (inside component)

interface Deal {
    id: string;
    title: string;
    description: string;
    price: number;
    original_price?: number;
    image_url: string;
    is_active: boolean;
}

export default function AdminDeals() {
    const [deals, setDeals] = useState<Deal[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
    const [formData, setFormData] = useState<Partial<Deal>>({
        title: "",
        description: "",
        price: 0,
        original_price: 0,
        image_url: "",
        is_active: true,
    });
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        fetchDeals();
    }, []);

    const fetchDeals = async () => {
        try {
            const { data, error } = await supabase
                .from("deals")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setDeals(data || []);
        } catch (error) {
            console.error("Error fetching deals:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            if (editingDeal) {
                const { error } = await supabase
                    .from("deals")
                    .update(formData)
                    .eq("id", editingDeal.id);
                if (error) throw error;
                toast({ title: "Deal updated successfully" });
            } else {
                const { error } = await supabase.from("deals").insert(formData);
                if (error) throw error;
                toast({ title: "Deal created successfully" });
            }
            setIsDialogOpen(false);
            fetchDeals();
            resetForm();
        } catch (error: any) {
            toast({
                title: "Error saving deal",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    const executeDelete = async () => {
        if (!deleteId) return;
        try {
            const { error } = await supabase.from("deals").delete().eq("id", deleteId);
            if (error) throw error;
            toast({ title: "Deal deleted" });
            fetchDeals();
        } catch (error) {
            toast({ title: "Error deleting deal", variant: "destructive" });
        } finally {
            setDeleteId(null);
        }
    };

    const resetForm = () => {
        setEditingDeal(null);
        setFormData({
            title: "",
            description: "",
            price: 0,
            original_price: 0,
            image_url: "",
            is_active: true,
        });
    };

    const openEdit = (deal: Deal) => {
        setEditingDeal(deal);
        setFormData(deal);
        setIsDialogOpen(true);
    };

    const handleBroadcast = async (deal: Deal) => {
        try {
            const { data: subscribers, error } = await supabase
                .from("subscribers")
                .select("email");

            if (error) throw error;

            if (!subscribers || subscribers.length === 0) {
                toast({
                    title: "No Subscribers",
                    description: "There are no subscribers to broadcast to yet.",
                    variant: "default",
                });
                return;
            }

            const emails = subscribers.map((s) => s.email).join(",");
            const subject = `🔥 Hot Deal: ${deal.title} at Pak Cuisine!`;
            const body = `Hi there!\n\nCheck out our latest special offer:\n\n${deal.title}\n${deal.description}\n\nPrice: $${deal.price}\n\nCome visit us or order online!\n\nBest,\nPak Cuisine Team`;

            window.location.href = `mailto:?bcc=${emails}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

            toast({
                title: "Client Opened",
                description: `Drafted email for ${subscribers.length} subscribers.`,
            });
        } catch (error) {
            toast({
                title: "Error fetching subscribers",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-display font-bold text-gradient-primary">
                        Deals & Specials
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        Manage your special offers and discounts
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={resetForm} className="gap-2">
                            <Plus className="w-4 h-4" /> New Deal
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>
                                {editingDeal ? "Edit Deal" : "Create New Deal"}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label>Title</Label>
                                <Input
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData({ ...formData, title: e.target.value })
                                    }
                                    placeholder="e.g. Family Feast"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Description</Label>
                                <Textarea
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                    placeholder="Details about the deal..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Deal Price ($)</Label>
                                    <Input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                price: parseFloat(e.target.value),
                                            })
                                        }
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Original Price ($)</Label>
                                    <Input
                                        type="number"
                                        value={formData.original_price}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                original_price: parseFloat(e.target.value),
                                            })
                                        }
                                        placeholder="Optional"
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <ImageUploader
                                    value={formData.image_url || ""}
                                    onChange={(url) => setFormData({ ...formData, image_url: url })}
                                    label="Deal Image"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Switch
                                    checked={formData.is_active}
                                    onCheckedChange={(checked) =>
                                        setFormData({ ...formData, is_active: checked })
                                    }
                                />
                                <Label>Active</Label>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleSave}>
                                <Save className="w-4 h-4 mr-2" /> Save Deal
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {deals.map((deal) => (
                    <Card key={deal.id} className="overflow-hidden group flex flex-col">
                        <div className="relative h-48 w-full">
                            <img
                                src={deal.image_url || "/placeholder.svg"}
                                alt={deal.title}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute top-2 right-2">
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-bold ${deal.is_active
                                        ? "bg-green-500 text-white"
                                        : "bg-gray-500 text-white"
                                        }`}
                                >
                                    {deal.is_active ? "ACTIVE" : "INACTIVE"}
                                </span>
                            </div>
                        </div>
                        <div className="p-4 space-y-3 flex-1 flex flex-col">
                            <div className="flex justify-between items-start">
                                <h3 className="font-bold text-lg">{deal.title}</h3>
                                <div className="text-right">
                                    <div className="font-bold text-xl text-primary">${deal.price}</div>
                                    {deal.original_price && (
                                        <div className="text-sm text-muted-foreground line-through">${deal.original_price}</div>
                                    )}
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
                                {deal.description}
                            </p>

                            <div className="pt-4 mt-auto space-y-2">
                                <Button
                                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                                    size="sm"
                                    onClick={() => handleBroadcast(deal)}
                                >
                                    <Tag className="w-4 h-4 mr-2" /> Broadcast to Subscribers
                                </Button>
                                <div className="flex justify-end gap-2 pt-2 border-t border-border">
                                    <Button variant="ghost" size="sm" onClick={() => openEdit(deal)}>
                                        <Edit className="w-4 h-4 mr-1" /> Edit
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                        onClick={() => setDeleteId(deal.id)}
                                    >
                                        <Trash2 className="w-4 h-4 mr-1" /> Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
            <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p>Are you sure you want to delete this deal? This action cannot be undone.</p>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
                        <Button variant="destructive" onClick={executeDelete}>Delete</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
