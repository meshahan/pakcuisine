import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
    value: string | null;
    onChange: (url: string | null) => void;
    label?: string;
    className?: string;
}

export function ImageUploader({ value, onChange, label = 'Image', className }: ImageUploaderProps) {
    const [urlInput, setUrlInput] = useState('');
    const [showUrlInput, setShowUrlInput] = useState(false);

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
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full h-32 border-dashed"
                            onClick={() => setShowUrlInput(true)}
                        >
                            <div className="flex flex-col items-center gap-2">
                                <ImageIcon className="w-8 h-8 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">Add Image URL</span>
                            </div>
                        </Button>
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
