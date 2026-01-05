import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { ImageUploader } from './ImageUploader';
import { GalleryImage } from '@/types/database';

export function AdminGallery() {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        image_url: '',
        caption: '',
        display_order: 0,
        is_visible: true,
    });

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('gallery_images')
            .select('*')
            .order('display_order');

        if (error) {
            toast({
                title: 'Error',
                description: 'Failed to fetch gallery images',
                variant: 'destructive',
            });
        } else {
            setImages(data || []);
        }
        setLoading(false);
    };

    const openCreateDialog = () => {
        setEditingImage(null);
        setFormData({
            image_url: '',
            caption: '',
            display_order: images.length,
            is_visible: true,
        });
        setDialogOpen(true);
    };

    const openEditDialog = (image: GalleryImage) => {
        setEditingImage(image);
        setFormData({
            image_url: image.image_url,
            caption: image.caption || '',
            display_order: image.display_order,
            is_visible: image.is_visible,
        });
        setDialogOpen(true);
    };

    const handleSave = async () => {
        if (!formData.image_url) {
            toast({
                title: 'Validation Error',
                description: 'Image URL is required',
                variant: 'destructive',
            });
            return;
        }

        let error;
        if (editingImage) {
            const { error: updateError } = await supabase
                .from('gallery_images')
                .update(formData)
                .eq('id', editingImage.id);
            error = updateError;
        } else {
            const { error: insertError } = await supabase
                .from('gallery_images')
                .insert([formData]);
            error = insertError;
        }

        if (error) {
            toast({
                title: 'Error',
                description: `Failed to ${editingImage ? 'update' : 'add'} image`,
                variant: 'destructive',
            });
        } else {
            toast({
                title: 'Success',
                description: `Image ${editingImage ? 'updated' : 'added'} successfully`,
            });
            setDialogOpen(false);
            fetchImages();
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this image?')) return;

        const { error } = await supabase.from('gallery_images').delete().eq('id', id);

        if (error) {
            toast({
                title: 'Error',
                description: 'Failed to delete image',
                variant: 'destructive',
            });
        } else {
            toast({ title: 'Success', description: 'Image deleted' });
            fetchImages();
        }
    };

    const toggleVisibility = async (image: GalleryImage) => {
        const { error } = await supabase
            .from('gallery_images')
            .update({ is_visible: !image.is_visible })
            .eq('id', image.id);

        if (error) {
            toast({
                title: 'Error',
                description: 'Failed to update visibility',
                variant: 'destructive',
            });
        } else {
            fetchImages();
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="font-display text-3xl font-bold text-foreground">Gallery Management</h1>
                <Button onClick={openCreateDialog}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Image
                </Button>
            </div>

            {loading ? (
                <div className="text-center py-12 text-muted-foreground">Loading...</div>
            ) : images.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    No images yet. Add your first gallery image!
                </div>
            ) : (
                <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((image) => (
                        <div
                            key={image.id}
                            className="group relative bg-card rounded-lg overflow-hidden shadow-sm border border-border hover:shadow-md transition-shadow"
                        >
                            <img
                                src={image.image_url}
                                alt={image.caption || 'Gallery image'}
                                className="w-full h-48 object-cover"
                            />
                            {!image.is_visible && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <EyeOff className="w-8 h-8 text-white" />
                                </div>
                            )}
                            <div className="p-3">
                                {image.caption && (
                                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                        {image.caption}
                                    </p>
                                )}
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => openEditDialog(image)}
                                    >
                                        <Edit className="w-3 h-3 mr-1" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => toggleVisibility(image)}
                                    >
                                        {image.is_visible ? (
                                            <EyeOff className="w-3 h-3" />
                                        ) : (
                                            <Eye className="w-3 h-3" />
                                        )}
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(image.id)}
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
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
                            {editingImage ? 'Edit Image' : 'Add Image'}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <ImageUploader
                            value={formData.image_url}
                            onChange={(url) => setFormData({ ...formData, image_url: url || '' })}
                            label="Image *"
                        />
                        <div>
                            <Label htmlFor="caption">Caption</Label>
                            <Input
                                id="caption"
                                value={formData.caption}
                                onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                                placeholder="Optional caption for the image"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_visible"
                                checked={formData.is_visible}
                                onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
                                className="w-4 h-4"
                            />
                            <Label htmlFor="is_visible" className="cursor-pointer">
                                Visible on website
                            </Label>
                        </div>
                        <div className="flex justify-end gap-2 pt-4 border-t">
                            <Button variant="outline" onClick={() => setDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleSave}>
                                {editingImage ? 'Update' : 'Add'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
