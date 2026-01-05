import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Star } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { ImageUploader } from './ImageUploader';
import { Testimonial } from '@/types/database';
import { Badge } from '@/components/ui/badge';

export function AdminTestimonials() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        customer_name: '',
        customer_image: null as string | null,
        rating: 5,
        review_text: '',
        is_featured: false,
        is_visible: true,
    });

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('testimonials')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            toast({
                title: 'Error',
                description: 'Failed to fetch testimonials',
                variant: 'destructive',
            });
        } else {
            setTestimonials(data || []);
        }
        setLoading(false);
    };

    const openCreateDialog = () => {
        setEditingTestimonial(null);
        setFormData({
            customer_name: '',
            customer_image: null,
            rating: 5,
            review_text: '',
            is_featured: false,
            is_visible: true,
        });
        setDialogOpen(true);
    };

    const openEditDialog = (testimonial: Testimonial) => {
        setEditingTestimonial(testimonial);
        setFormData({
            customer_name: testimonial.customer_name,
            customer_image: testimonial.customer_image,
            rating: testimonial.rating,
            review_text: testimonial.review_text,
            is_featured: testimonial.is_featured,
            is_visible: testimonial.is_visible,
        });
        setDialogOpen(true);
    };

    const handleSave = async () => {
        if (!formData.customer_name || !formData.review_text) {
            toast({
                title: 'Validation Error',
                description: 'Customer name and review text are required',
                variant: 'destructive',
            });
            return;
        }

        let error;
        if (editingTestimonial) {
            const { error: updateError } = await supabase
                .from('testimonials')
                .update(formData)
                .eq('id', editingTestimonial.id);
            error = updateError;
        } else {
            const { error: insertError } = await supabase
                .from('testimonials')
                .insert([formData]);
            error = insertError;
        }

        if (error) {
            toast({
                title: 'Error',
                description: `Failed to ${editingTestimonial ? 'update' : 'create'} testimonial`,
                variant: 'destructive',
            });
        } else {
            toast({
                title: 'Success',
                description: `Testimonial ${editingTestimonial ? 'updated' : 'created'} successfully`,
            });
            setDialogOpen(false);
            fetchTestimonials();
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this testimonial?')) return;

        const { error } = await supabase.from('testimonials').delete().eq('id', id);

        if (error) {
            toast({
                title: 'Error',
                description: 'Failed to delete testimonial',
                variant: 'destructive',
            });
        } else {
            toast({ title: 'Success', description: 'Testimonial deleted' });
            fetchTestimonials();
        }
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    }`}
            />
        ));
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="font-display text-3xl font-bold text-foreground">Testimonials</h1>
                <Button onClick={openCreateDialog}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Testimonial
                </Button>
            </div>

            {loading ? (
                <div className="text-center py-12 text-muted-foreground">Loading...</div>
            ) : testimonials.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    No testimonials yet. Add your first testimonial!
                </div>
            ) : (
                <div className="space-y-4">
                    {testimonials.map((testimonial) => (
                        <div
                            key={testimonial.id}
                            className="bg-card rounded-lg p-6 shadow-sm border border-border hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start gap-4">
                                {testimonial.customer_image && (
                                    <img
                                        src={testimonial.customer_image}
                                        alt={testimonial.customer_name}
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                )}
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h3 className="font-display font-semibold text-foreground">
                                                {testimonial.customer_name}
                                            </h3>
                                            <div className="flex gap-1 mt-1">
                                                {renderStars(testimonial.rating)}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            {testimonial.is_featured && (
                                                <Badge variant="default">Featured</Badge>
                                            )}
                                            {!testimonial.is_visible && (
                                                <Badge variant="secondary">Hidden</Badge>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground mb-4">{testimonial.review_text}</p>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => openEditDialog(testimonial)}
                                        >
                                            <Edit className="w-3 h-3 mr-1" />
                                            Edit
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDelete(testimonial.id)}
                                        >
                                            <Trash2 className="w-3 h-3 mr-1" />
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingTestimonial ? 'Edit Testimonial' : 'New Testimonial'}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name">Customer Name *</Label>
                            <Input
                                id="name"
                                value={formData.customer_name}
                                onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                                placeholder="John Doe"
                            />
                        </div>
                        <ImageUploader
                            value={formData.customer_image}
                            onChange={(url) => setFormData({ ...formData, customer_image: url })}
                            label="Customer Photo"
                        />
                        <div>
                            <Label htmlFor="rating">Rating (1-5)</Label>
                            <Input
                                id="rating"
                                type="number"
                                min="1"
                                max="5"
                                value={formData.rating}
                                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) || 5 })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="review">Review Text *</Label>
                            <Textarea
                                id="review"
                                value={formData.review_text}
                                onChange={(e) => setFormData({ ...formData, review_text: e.target.value })}
                                placeholder="The food was amazing..."
                                rows={4}
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="featured"
                                    checked={formData.is_featured}
                                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                                    className="w-4 h-4"
                                />
                                <Label htmlFor="featured" className="cursor-pointer">Featured</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="visible"
                                    checked={formData.is_visible}
                                    onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
                                    className="w-4 h-4"
                                />
                                <Label htmlFor="visible" className="cursor-pointer">Visible on website</Label>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-4 border-t">
                            <Button variant="outline" onClick={() => setDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleSave}>
                                {editingTestimonial ? 'Update' : 'Create'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
