import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Calendar,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { RichTextEditor } from './RichTextEditor';
import { ImageUploader } from './ImageUploader';
import { BlogPost } from '@/types/database';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

export function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: null as string | null,
    is_published: false,
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch blog posts',
        variant: 'destructive',
      });
    } else {
      setPosts(data || []);
    }
    setLoading(false);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }));
  };

  const openCreateDialog = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      featured_image: null,
      is_published: false,
    });
    setDialogOpen(true);
  };

  const openEditDialog = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      content: post.content,
      featured_image: post.featured_image,
      is_published: post.is_published || false,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.slug || !formData.content) {
      toast({
        title: 'Validation Error',
        description: 'Title, slug, and content are required',
        variant: 'destructive',
      });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();

    const postData = {
      ...formData,
      author_id: user?.id,
      published_at: formData.is_published ? new Date().toISOString() : null,
    };

    let error;
    if (editingPost) {
      const { error: updateError } = await supabase
        .from('blog_posts')
        .update(postData)
        .eq('id', editingPost.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('blog_posts')
        .insert([postData]);
      error = insertError;
    }

    if (error) {
      toast({
        title: 'Error',
        description: `Failed to ${editingPost ? 'update' : 'create'} post`,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: `Post ${editingPost ? 'updated' : 'created'} successfully`,
      });
      setDialogOpen(false);
      fetchPosts();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    const { error } = await supabase.from('blog_posts').delete().eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete post',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Post deleted successfully',
      });
      fetchPosts();
    }
  };

  const togglePublish = async (post: BlogPost) => {
    const { error } = await supabase
      .from('blog_posts')
      .update({
        is_published: !post.is_published,
        published_at: !post.is_published ? new Date().toISOString() : null,
      })
      .eq('id', post.id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update post status',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: `Post ${!post.is_published ? 'published' : 'unpublished'}`,
      });
      fetchPosts();
    }
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Blog Management</h1>
        <Button onClick={openCreateDialog}>
          <Plus className="w-4 h-4 mr-2" />
          New Post
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Posts List */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {searchQuery ? 'No posts found' : 'No posts yet. Create your first post!'}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-card rounded-lg p-6 shadow-sm border border-border hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                {post.featured_image && (
                  <img
                    src={post.featured_image}
                    alt={post.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h3 className="font-display text-xl font-semibold text-foreground mb-1">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">/{post.slug}</p>
                    </div>
                    <Badge variant={post.is_published ? 'default' : 'secondary'}>
                      {post.is_published ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                  {post.excerpt && (
                    <p className="text-muted-foreground line-clamp-2 mb-3">{post.excerpt}</p>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Calendar className="w-4 h-4" />
                    {new Date(post.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(post)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => togglePublish(post)}
                    >
                      {post.is_published ? (
                        <>
                          <EyeOff className="w-4 h-4 mr-1" />
                          Unpublish
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 mr-1" />
                          Publish
                        </>
                      )}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(post.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPost ? 'Edit Post' : 'Create New Post'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Title */}
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter post title"
              />
            </div>

            {/* Slug */}
            <div>
              <Label htmlFor="slug">URL Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="url-friendly-slug"
              />
            </div>

            {/* Excerpt */}
            <div>
              <Label htmlFor="excerpt">Excerpt (SEO Description)</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Brief description for SEO and previews"
                rows={3}
              />
            </div>

            {/* Featured Image */}
            <ImageUploader
              value={formData.featured_image}
              onChange={(url) => setFormData({ ...formData, featured_image: url })}
              label="Featured Image"
            />

            {/* Content */}
            <div>
              <Label>Content *</Label>
              <RichTextEditor
                content={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
                placeholder="Write your post content here..."
              />
            </div>

            {/* Publish Toggle */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_published"
                checked={formData.is_published}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="is_published" className="cursor-pointer">
                Publish immediately
              </Label>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {editingPost ? 'Update Post' : 'Create Post'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
