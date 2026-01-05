import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Save, Palette, Globe, Clock, Phone, Mail, MapPin } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SiteSettings {
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
  };
  seo?: {
    siteTitle?: string;
    siteDescription?: string;
    keywords?: string;
  };
  contact?: {
    phone?: string;
    email?: string;
    address?: string;
  };
  social?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

export function AdminSettings() {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('site_settings')
      .select('*');

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch settings',
        variant: 'destructive',
      });
    } else {
      // Convert array of key-value pairs to nested object
      const settingsObj: SiteSettings = {};
      data?.forEach((item) => {
        settingsObj[item.key as keyof SiteSettings] = item.value;
      });
      setSettings(settingsObj);
    }
    setLoading(false);
  };

  const updateSetting = async (key: string, value: any) => {
    const { error } = await supabase
      .from('site_settings')
      .upsert({ key, value }, { onConflict: 'key' });

    if (error) {
      throw error;
    }
  };

  const handleSaveTheme = async () => {
    setSaving(true);
    try {
      await updateSetting('theme', settings.theme || {});
      toast({
        title: 'Success',
        description: 'Theme settings saved successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save theme settings',
        variant: 'destructive',
      });
    }
    setSaving(false);
  };

  const handleSaveSEO = async () => {
    setSaving(true);
    try {
      await updateSetting('seo', settings.seo || {});
      toast({
        title: 'Success',
        description: 'SEO settings saved successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save SEO settings',
        variant: 'destructive',
      });
    }
    setSaving(false);
  };

  const handleSaveContact = async () => {
    setSaving(true);
    try {
      await updateSetting('contact', settings.contact || {});
      await updateSetting('social', settings.social || {});
      toast({
        title: 'Success',
        description: 'Contact settings saved successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save contact settings',
        variant: 'destructive',
      });
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground">Loading...</div>;
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-foreground mb-8">Site Settings</h1>

      <Tabs defaultValue="theme" className="space-y-6">
        <TabsList>
          <TabsTrigger value="theme">
            <Palette className="w-4 h-4 mr-2" />
            Theme
          </TabsTrigger>
          <TabsTrigger value="seo">
            <Globe className="w-4 h-4 mr-2" />
            SEO
          </TabsTrigger>
          <TabsTrigger value="contact">
            <Phone className="w-4 h-4 mr-2" />
            Contact
          </TabsTrigger>
        </TabsList>

        {/* Theme Settings */}
        <TabsContent value="theme">
          <div className="bg-card rounded-lg p-6 shadow-sm border border-border space-y-6">
            <div>
              <h2 className="font-display text-xl font-semibold mb-4">Color Scheme</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Customize your site's color palette. Changes will be reflected across the entire website.
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="primary-color"
                      type="color"
                      value={settings.theme?.primaryColor || '#3B82F6'}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          theme: { ...settings.theme, primaryColor: e.target.value },
                        })
                      }
                      className="w-20 h-10"
                    />
                    <Input
                      type="text"
                      value={settings.theme?.primaryColor || '#3B82F6'}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          theme: { ...settings.theme, primaryColor: e.target.value },
                        })
                      }
                      placeholder="#3B82F6"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="secondary-color">Secondary Color</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="secondary-color"
                      type="color"
                      value={settings.theme?.secondaryColor || '#8B5CF6'}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          theme: { ...settings.theme, secondaryColor: e.target.value },
                        })
                      }
                      className="w-20 h-10"
                    />
                    <Input
                      type="text"
                      value={settings.theme?.secondaryColor || '#8B5CF6'}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          theme: { ...settings.theme, secondaryColor: e.target.value },
                        })
                      }
                      placeholder="#8B5CF6"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="accent-color">Accent Color</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="accent-color"
                      type="color"
                      value={settings.theme?.accentColor || '#F59E0B'}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          theme: { ...settings.theme, accentColor: e.target.value },
                        })
                      }
                      className="w-20 h-10"
                    />
                    <Input
                      type="text"
                      value={settings.theme?.accentColor || '#F59E0B'}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          theme: { ...settings.theme, accentColor: e.target.value },
                        })
                      }
                      placeholder="#F59E0B"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button onClick={handleSaveTheme} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Theme Settings'}
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* SEO Settings */}
        <TabsContent value="seo">
          <div className="bg-card rounded-lg p-6 shadow-sm border border-border space-y-6">
            <div>
              <h2 className="font-display text-xl font-semibold mb-4">SEO Configuration</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Configure default SEO settings for your website. These will be used as fallbacks when specific pages don't have custom SEO data.
              </p>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="site-title">Site Title</Label>
                  <Input
                    id="site-title"
                    value={settings.seo?.siteTitle || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        seo: { ...settings.seo, siteTitle: e.target.value },
                      })
                    }
                    placeholder="Pak Cuisine - Authentic Pakistani Restaurant"
                  />
                </div>

                <div>
                  <Label htmlFor="site-description">Site Description</Label>
                  <Textarea
                    id="site-description"
                    value={settings.seo?.siteDescription || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        seo: { ...settings.seo, siteDescription: e.target.value },
                      })
                    }
                    placeholder="Experience authentic Pakistani cuisine with traditional recipes and modern flavors..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="keywords">Keywords (comma-separated)</Label>
                  <Input
                    id="keywords"
                    value={settings.seo?.keywords || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        seo: { ...settings.seo, keywords: e.target.value },
                      })
                    }
                    placeholder="pakistani food, halal restaurant, biryani, karahi, authentic cuisine"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button onClick={handleSaveSEO} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save SEO Settings'}
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Contact Settings */}
        <TabsContent value="contact">
          <div className="bg-card rounded-lg p-6 shadow-sm border border-border space-y-6">
            <div>
              <h2 className="font-display text-xl font-semibold mb-4">Contact Information</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Update your restaurant's contact details and social media links.
              </p>

              <div className="space-y-6">
                {/* Contact Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Contact Details
                  </h3>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={settings.contact?.phone || ''}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          contact: { ...settings.contact, phone: e.target.value },
                        })
                      }
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={settings.contact?.email || ''}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          contact: { ...settings.contact, email: e.target.value },
                        })
                      }
                      placeholder="info@pakcuisine.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={settings.contact?.address || ''}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          contact: { ...settings.contact, address: e.target.value },
                        })
                      }
                      placeholder="123 Main Street, City, State 12345"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Social Media */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="font-semibold">Social Media Links</h3>
                  <div>
                    <Label htmlFor="facebook">Facebook URL</Label>
                    <Input
                      id="facebook"
                      value={settings.social?.facebook || ''}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          social: { ...settings.social, facebook: e.target.value },
                        })
                      }
                      placeholder="https://facebook.com/pakcuisine"
                    />
                  </div>
                  <div>
                    <Label htmlFor="instagram">Instagram URL</Label>
                    <Input
                      id="instagram"
                      value={settings.social?.instagram || ''}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          social: { ...settings.social, instagram: e.target.value },
                        })
                      }
                      placeholder="https://instagram.com/pakcuisine"
                    />
                  </div>
                  <div>
                    <Label htmlFor="twitter">Twitter/X URL</Label>
                    <Input
                      id="twitter"
                      value={settings.social?.twitter || ''}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          social: { ...settings.social, twitter: e.target.value },
                        })
                      }
                      placeholder="https://twitter.com/pakcuisine"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button onClick={handleSaveContact} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Contact Settings'}
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
