import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, GripVertical } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageUploader } from './ImageUploader';
import { MenuCategory, MenuItem } from '@/types/database';
import { Badge } from '@/components/ui/badge';

export function AdminMenu() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const { toast } = useToast();

  // Category form
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    display_order: 0,
    is_active: true,
  });

  // Item form
  const [itemForm, setItemForm] = useState({
    category_id: '',
    name: '',
    description: '',
    price: 0,
    image_url: null as string | null,
    is_vegetarian: false,
    is_halal: true,
    is_gluten_free: false,
    spicy_level: 0,
    is_featured: false,
    is_available: true,
    display_order: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [categoriesRes, itemsRes] = await Promise.all([
      supabase.from('menu_categories').select('*').order('display_order'),
      supabase.from('menu_items').select('*').order('display_order'),
    ]);

    if (categoriesRes.error || itemsRes.error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch menu data',
        variant: 'destructive',
      });
    } else {
      setCategories(categoriesRes.data || []);
      setItems(itemsRes.data || []);
    }
    setLoading(false);
  };

  // Category handlers
  const openCreateCategoryDialog = () => {
    setEditingCategory(null);
    setCategoryForm({
      name: '',
      description: '',
      display_order: categories.length,
      is_active: true,
    });
    setCategoryDialogOpen(true);
  };

  const openEditCategoryDialog = (category: MenuCategory) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      description: category.description || '',
      display_order: category.display_order,
      is_active: category.is_active,
    });
    setCategoryDialogOpen(true);
  };

  const handleSaveCategory = async () => {
    if (!categoryForm.name) {
      toast({
        title: 'Validation Error',
        description: 'Category name is required',
        variant: 'destructive',
      });
      return;
    }

    let error;
    if (editingCategory) {
      const { error: updateError } = await supabase
        .from('menu_categories')
        .update(categoryForm)
        .eq('id', editingCategory.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('menu_categories')
        .insert([categoryForm]);
      error = insertError;
    }

    if (error) {
      toast({
        title: 'Error',
        description: `Failed to ${editingCategory ? 'update' : 'create'} category`,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: `Category ${editingCategory ? 'updated' : 'created'} successfully`,
      });
      setCategoryDialogOpen(false);
      fetchData();
    }
  };

  // Item handlers
  const openCreateItemDialog = () => {
    setEditingItem(null);
    setItemForm({
      category_id: categories[0]?.id || '',
      name: '',
      description: '',
      price: 0,
      image_url: null,
      is_vegetarian: false,
      is_halal: true,
      is_gluten_free: false,
      spicy_level: 0,
      is_featured: false,
      is_available: true,
      display_order: items.length,
    });
    setItemDialogOpen(true);
  };

  const openEditItemDialog = (item: MenuItem) => {
    setEditingItem(item);
    setItemForm({
      category_id: item.category_id || '',
      name: item.name,
      description: item.description || '',
      price: item.price,
      image_url: item.image_url,
      is_vegetarian: item.is_vegetarian,
      is_halal: item.is_halal,
      is_gluten_free: item.is_gluten_free,
      spicy_level: item.spicy_level,
      is_featured: item.is_featured,
      is_available: item.is_available,
      display_order: item.display_order,
    });
    setItemDialogOpen(true);
  };

  const handleSaveItem = async () => {
    if (!itemForm.name || itemForm.price <= 0) {
      toast({
        title: 'Validation Error',
        description: 'Name and valid price are required',
        variant: 'destructive',
      });
      return;
    }

    let error;
    if (editingItem) {
      const { error: updateError } = await supabase
        .from('menu_items')
        .update(itemForm)
        .eq('id', editingItem.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('menu_items')
        .insert([itemForm]);
      error = insertError;
    }

    if (error) {
      toast({
        title: 'Error',
        description: `Failed to ${editingItem ? 'update' : 'create'} item`,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: `Item ${editingItem ? 'updated' : 'created'} successfully`,
      });
      setItemDialogOpen(false);
      fetchData();
    }
  };

  // Delete confirmation state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null); // For item vs category distinction if needed, or just use different states

  const confirmDeleteCategory = (id: string) => {
    setDeleteId(id);
    setItemToDelete('category');
  };

  const confirmDeleteItem = (id: string) => {
    setDeleteId(id);
    setItemToDelete('item');
  };

  const executeDelete = async () => {
    if (!deleteId) return;

    if (itemToDelete === 'category') {
      const { error } = await supabase.from('menu_categories').delete().eq('id', deleteId);
      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete category',
          variant: 'destructive',
        });
      } else {
        toast({ title: 'Success', description: 'Category deleted' });
        fetchData();
      }
    } else {
      const { error } = await supabase.from('menu_items').delete().eq('id', deleteId);
      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete item',
          variant: 'destructive',
        });
      } else {
        toast({ title: 'Success', description: 'Item deleted' });
        fetchData();
      }
    }
    setDeleteId(null);
    setItemToDelete(null);
  };

  // ... (rest of code)

  // Update the button onClick handlers in the JSX:
  // onClick={() => confirmDeleteCategory(category.id)}
  // onClick={() => confirmDeleteItem(item.id)}



  const getCategoryName = (categoryId: string | null) => {
    return categories.find((c) => c.id === categoryId)?.name || 'Uncategorized';
  };

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground">Loading...</div>;
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-foreground mb-8">Menu Management</h1>

      <Tabs defaultValue="items" className="space-y-6">
        <TabsList>
          <TabsTrigger value="items">Menu Items</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        {/* Menu Items Tab */}
        <TabsContent value="items" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={openCreateItemDialog}>
              <Plus className="w-4 h-4 mr-2" />
              New Item
            </Button>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No menu items yet. Create your first item!
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-card rounded-lg overflow-hidden shadow-sm border border-border hover:shadow-md transition-shadow"
                >
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-40 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-display font-semibold text-foreground">
                          {item.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {getCategoryName(item.category_id)}
                        </p>
                      </div>
                      <span className="font-bold text-primary">${item.price.toFixed(2)}</span>
                    </div>
                    {item.description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.is_vegetarian && (
                        <Badge variant="secondary" className="text-xs">Veg</Badge>
                      )}
                      {item.is_halal && (
                        <Badge variant="secondary" className="text-xs">Halal</Badge>
                      )}
                      {item.is_gluten_free && (
                        <Badge variant="secondary" className="text-xs">GF</Badge>
                      )}
                      {item.spicy_level > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {'🌶️'.repeat(item.spicy_level)}
                        </Badge>
                      )}
                      {item.is_featured && (
                        <Badge variant="default" className="text-xs">Featured</Badge>
                      )}
                      {!item.is_available && (
                        <Badge variant="outline" className="text-xs">Unavailable</Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditItemDialog(item)}
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => confirmDeleteItem(item.id)}
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={openCreateCategoryDialog}>
              <Plus className="w-4 h-4 mr-2" />
              New Category
            </Button>
          </div>

          {categories.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No categories yet. Create your first category!
            </div>
          ) : (
            <div className="space-y-3">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="bg-card rounded-lg p-4 shadow-sm border border-border flex items-center gap-4"
                >
                  <GripVertical className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-display font-semibold text-foreground">
                        {category.name}
                      </h3>
                      <Badge variant={category.is_active ? 'default' : 'secondary'}>
                        {category.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    {category.description && (
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditCategoryDialog(category)}
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Category Dialog */}
      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Edit Category' : 'Create Category'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="cat-name">Name *</Label>
              <Input
                id="cat-name"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="cat-desc">Description</Label>
              <Textarea
                id="cat-desc"
                value={categoryForm.description}
                onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="cat-active"
                checked={categoryForm.is_active}
                onChange={(e) => setCategoryForm({ ...categoryForm, is_active: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="cat-active" className="cursor-pointer">Active</Label>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setCategoryDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveCategory}>
                {editingCategory ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Item Dialog */}
      <Dialog open={itemDialogOpen} onOpenChange={setItemDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Edit Menu Item' : 'Create Menu Item'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="item-name">Name *</Label>
              <Input
                id="item-name"
                value={itemForm.name}
                onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="item-category">Category</Label>
              <select
                id="item-category"
                value={itemForm.category_id}
                onChange={(e) => setItemForm({ ...itemForm, category_id: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
              >
                <option value="">Uncategorized</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="item-desc">Description</Label>
              <Textarea
                id="item-desc"
                value={itemForm.description}
                onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="item-price">Price ($) *</Label>
              <Input
                id="item-price"
                type="number"
                step="0.01"
                min="0"
                value={itemForm.price}
                onChange={(e) => setItemForm({ ...itemForm, price: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <ImageUploader
              value={itemForm.image_url || ""}
              onChange={(url) => setItemForm({ ...itemForm, image_url: url })}
              label="Item Image"
            />
            <div>
              <Label htmlFor="spicy">Spicy Level (0-3)</Label>
              <Input
                id="spicy"
                type="number"
                min="0"
                max="3"
                value={itemForm.spicy_level}
                onChange={(e) => setItemForm({ ...itemForm, spicy_level: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="item-veg"
                  checked={itemForm.is_vegetarian}
                  onChange={(e) => setItemForm({ ...itemForm, is_vegetarian: e.target.checked })}
                  className="w-4 h-4"
                />
                <Label htmlFor="item-veg" className="cursor-pointer">Vegetarian</Label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="item-halal"
                  checked={itemForm.is_halal}
                  onChange={(e) => setItemForm({ ...itemForm, is_halal: e.target.checked })}
                  className="w-4 h-4"
                />
                <Label htmlFor="item-halal" className="cursor-pointer">Halal</Label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="item-gf"
                  checked={itemForm.is_gluten_free}
                  onChange={(e) => setItemForm({ ...itemForm, is_gluten_free: e.target.checked })}
                  className="w-4 h-4"
                />
                <Label htmlFor="item-gf" className="cursor-pointer">Gluten Free</Label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="item-featured"
                  checked={itemForm.is_featured}
                  onChange={(e) => setItemForm({ ...itemForm, is_featured: e.target.checked })}
                  className="w-4 h-4"
                />
                <Label htmlFor="item-featured" className="cursor-pointer">Featured</Label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="item-available"
                  checked={itemForm.is_available}
                  onChange={(e) => setItemForm({ ...itemForm, is_available: e.target.checked })}
                  className="w-4 h-4"
                />
                <Label htmlFor="item-available" className="cursor-pointer">Available</Label>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setItemDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveItem}>
                {editingItem ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this {itemToDelete}? This action cannot be undone.</p>
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
