
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

interface ImageUploaderProps {
    value: string | null;
    onChange: (url: string | null) => void;
    label?: string;
    className?: string;
}

export function ImageUploader({ value, onChange, label = 'Image', className }: ImageUploaderProps) {
    const [urlInput, setUrlInput] = useState('');
    const [showUrlInput, setShowUrlInput] = useState(false);
    const [uploading, setUploading] = useState(false);

    const handleUrlSubmit = () => {
        if (urlInput.trim()) {
            onChange(urlInput.trim());
            setUrlInput('');
            setShowUrlInput(false);
        }
    };

    const handleRemove = () => {
        onChange(null);
        setUrlInput('');
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = event.target.files?.[0];
            if (!file) return;

            setUploading(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage
                .from('images')
                .getPublicUrl(filePath);

            if (data) {
                onChange(data.publicUrl);
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image!');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className={cn('space-y-2', className)}>
            <Label>{label}</Label>

            {value ? (
                <div className="relative group">
                    <img
                        src={value}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg border border-border"
                    />
                    <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={handleRemove}
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            ) : (
                <div className="space-y-2">
                    {!showUrlInput ? (
                        <div className="grid grid-cols-2 gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                className="h-32 border-dashed flex flex-col items-center gap-2"
                                onClick={() => document.getElementById('file-upload')?.click()}
                                disabled={uploading}
                            >
                                {uploading ? (
                                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                ) : (
                                    <Upload className="w-8 h-8 text-muted-foreground" />
                                )}
                                <span className="text-sm text-muted-foreground">
                                    {uploading ? 'Uploading...' : 'Upload File'}
                                </span>
                            </Button>
                            <input
                                id="file-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileUpload}
                                disabled={uploading}
                            />

                            <Button
                                type="button"
                                variant="outline"
                                className="h-32 border-dashed flex flex-col items-center gap-2"
                                onClick={() => setShowUrlInput(true)}
                            >
                                <ImageIcon className="w-8 h-8 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">Add from URL</span>
                            </Button>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <Input
                                type="url"
                                placeholder="https://example.com/image.jpg"
                                value={urlInput}
                                onChange={(e) => setUrlInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleUrlSubmit())}
                            />
                            <Button type="button" onClick={handleUrlSubmit}>
                                Add
                            </Button>
                            <Button type="button" variant="ghost" onClick={() => setShowUrlInput(false)}>
                                Cancel
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
