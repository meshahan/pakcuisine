import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Shield, User } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface AdminUser {
    id: string;
    email: string;
    created_at: string;
    last_sign_in_at: string | null;
}

export function AdminUsers() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        fullName: "",
    });

    // Note: Standard Supabase client can't list all users (requires service role).
    // For this demo, we'll fetch from a custom view or just show the current user
    // and maintain a separate 'user_profiles' table if needed.
    // Ideally, we'd have a public.profiles table that triggers on auth.users insert.
    // Since we don't have that yet, this list might be empty or restricted.
    // We will assume for now we are just implementing the "Create" functionality.

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);

        try {
            // Call the RPC function we just created
            const { data, error } = await supabase.rpc('create_new_user', {
                email: formData.email,
                password: formData.password,
                full_name: formData.fullName
            });

            if (error) throw error;

            toast({
                title: "User Created",
                description: `Successfully created admin user: ${formData.email}`,
            });
            setIsDialogOpen(false);
            setFormData({ email: "", password: "", fullName: "" });

        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to create user",
                variant: "destructive",
            });
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-display text-3xl font-bold text-foreground">Admin Users</h1>
                    <p className="text-muted-foreground mt-1">Manage who can access this dashboard.</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Add New Admin
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Admin User</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreateUser} className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullname">Full Name</Label>
                                <Input
                                    id="fullname"
                                    placeholder="Jane Doe"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="jane@admin.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    minLength={6}
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={isCreating}>
                                {isCreating ? "Creating..." : "Create Admin User"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="bg-card rounded-xl border border-border p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <Shield className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Secure User Management</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                    Use the "Add New Admin" button to create additional accounts that can access this dashboard.
                    Listing all users requires additional database setup (profiles table).
                </p>
            </div>
        </div>
    );
}
