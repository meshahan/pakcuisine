import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import { Button } from '@/components/ui/button';
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Heading2,
    Quote,
    Undo,
    Redo,
    Link as LinkIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
    className?: string;
}

export function RichTextEditor({ content, onChange, placeholder = 'Start writing...', className }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder,
            }),
            Link.configure({
                openOnClick: false,
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    if (!editor) {
        return null;
    }

    const addLink = () => {
        const url = window.prompt('Enter URL:');
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    return (
        <div className={cn('border border-border rounded-lg overflow-hidden', className)}>
            {/* Toolbar */}
            <div className="bg-muted border-b border-border p-2 flex flex-wrap gap-1">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={editor.isActive('bold') ? 'bg-accent' : ''}
                >
                    <Bold className="w-4 h-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={editor.isActive('italic') ? 'bg-accent' : ''}
                >
                    <Italic className="w-4 h-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={editor.isActive('heading', { level: 2 }) ? 'bg-accent' : ''}
                >
                    <Heading2 className="w-4 h-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={editor.isActive('bulletList') ? 'bg-accent' : ''}
                >
                    <List className="w-4 h-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={editor.isActive('orderedList') ? 'bg-accent' : ''}
                >
                    <ListOrdered className="w-4 h-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={editor.isActive('blockquote') ? 'bg-accent' : ''}
                >
                    <Quote className="w-4 h-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={addLink}
                    className={editor.isActive('link') ? 'bg-accent' : ''}
                >
                    <LinkIcon className="w-4 h-4" />
                </Button>
                <div className="flex-1" />
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                >
                    <Undo className="w-4 h-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                >
                    <Redo className="w-4 h-4" />
                </Button>
            </div>

            {/* Editor */}
            <EditorContent
                editor={editor}
                className="prose prose-sm max-w-none p-4 min-h-[300px] focus:outline-none"
            />
        </div>
    );
}
