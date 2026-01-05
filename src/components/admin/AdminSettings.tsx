import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Save, Palette, Globe, Clock, Phone, Mail, MapPin, Server, ShieldCheck, Eye, EyeOff } from 'lucide-react';
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
  email?: {
    smtpHost?: string;
    smtpPort?: string;
    smtpUser?: string;
    smtpPass?: string;
    senderName?: string;
  };
}

export function AdminSettings() {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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

    if (error) throw error;
  };

  const handleSaveTheme = async () => {
    setSaving(true);
    try {
      await updateSetting('theme', settings.theme || {});
      toast({ title: 'Success', description: 'Theme settings saved successfully' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save theme settings', variant: 'destructive' });
    }
    setSaving(false);
  };

  const handleSaveSEO = async () => {
    setSaving(true);
    try {
      await updateSetting('seo', settings.seo || {});
      toast({ title: 'Success', description: 'SEO settings saved successfully' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save SEO settings', variant: 'destructive' });
    }
    setSaving(false);
  };

  const handleSaveContact = async () => {
    setSaving(true);
    try {
      await updateSetting('contact', settings.contact || {});
      await updateSetting('social', settings.social || {});
      toast({ title: 'Success', description: 'Contact settings saved successfully' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save contact settings', variant: 'destructive' });
    }
    setSaving(false);
  };

  const handleSaveEmail = async () => {
    setSaving(true);
    try {
      await updateSetting('email', settings.email || {});
      toast({ title: 'Success', description: 'Email configuration saved successfully' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save email configuration', variant: 'destructive' });
    }
    setSaving(false);
  };

  const handleTestConnection = async () => {
    if (!settings.email?.smtpHost || !settings.email?.smtpUser || !settings.email?.smtpPass) {
      toast({ title: 'Missing Info', description: 'Please fill in SMTP Host, User, and Password first.', variant: 'destructive' });
      return;
    }

    setTesting(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          type: 'test',
          payload: { email: settings.email.smtpUser, name: 'Admin Test' },
          config: settings.email
        }
      });
      if (error) throw error;
      toast({ title: 'Connection Successful', description: 'A test email has been sent to ' + settings.email.smtpUser });
    } catch (error: any) {
      toast({ title: 'Connection Failed', description: error.message || 'Check your SMTP credentials.', variant: 'destructive' });
    }
    setTesting(false);
  };

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold text-foreground mb-8">Site Settings</h1>

      <Tabs defaultValue="theme" className="space-y-6">
        <TabsList>
          <TabsTrigger value="theme"><Palette className="w-4 h-4 mr-2" /> Theme</TabsTrigger>
          <TabsTrigger value="seo"><Globe className="w-4 h-4 mr-2" /> SEO</TabsTrigger>
          <TabsTrigger value="contact"><Phone className="w-4 h-4 mr-2" /> Contact</TabsTrigger>
          <TabsTrigger value="email"><Mail className="w-4 h-4 mr-2" /> Email Integration</TabsTrigger>
        </TabsList>

        <TabsContent value="theme">
          <div className="bg-card rounded-lg p-6 shadow-sm border border-border space-y-6">
            <h2 className="font-display text-xl font-semibold mb-4">Color Scheme</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {['Primary', 'Secondary', 'Accent'].map((color) => {
                const key = `${color.toLowerCase()}Color` as keyof NonNullable<SiteSettings['theme']>;
                return (
                  <div key={color}>
                    <Label>{color} Color</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        type="color"
                        value={settings.theme?.[key] || (color === 'Primary' ? '#3B82F6' : color === 'Secondary' ? '#8B5CF6' : '#F59E0B')}
                        onChange={(e) => setSettings({ ...settings, theme: { ...settings.theme, [key]: e.target.value } })}
                        className="w-20 h-10"
                      />
                      <Input
                        type="text"
                        value={settings.theme?.[key] || ''}
                        onChange={(e) => setSettings({ ...settings, theme: { ...settings.theme, [key]: e.target.value } })}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-end pt-4 border-t">
              <Button onClick={handleSaveTheme} disabled={saving}><Save className="w-4 h-4 mr-2" /> Save Theme </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="seo">
          <div className="bg-card rounded-lg p-6 shadow-sm border border-border space-y-6">
            <h2 className="font-display text-xl font-semibold mb-4">SEO Configuration</h2>
            <div className="space-y-4">
              <div>
                <Label>Site Title</Label>
                <Input value={settings.seo?.siteTitle || ''} onChange={(e) => setSettings({ ...settings, seo: { ...settings.seo, siteTitle: e.target.value } })} />
              </div>
              <div>
                <Label>Site Description</Label>
                <Textarea value={settings.seo?.siteDescription || ''} onChange={(e) => setSettings({ ...settings, seo: { ...settings.seo, siteDescription: e.target.value } })} rows={4} />
              </div>
              <div>
                <Label>Keywords</Label>
                <Input value={settings.seo?.keywords || ''} onChange={(e) => setSettings({ ...settings, seo: { ...settings.seo, keywords: e.target.value } })} />
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t">
              <Button onClick={handleSaveSEO} disabled={saving}><Save className="w-4 h-4 mr-2" /> Save SEO </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="contact">
          <div className="bg-card rounded-lg p-6 shadow-sm border border-border space-y-6">
            <h2 className="font-display text-xl font-semibold mb-4">Contact Information</h2>
            <div className="space-y-4">
              <Input placeholder="Phone" value={settings.contact?.phone || ''} onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, phone: e.target.value } })} />
              <Input placeholder="Email" value={settings.contact?.email || ''} onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, email: e.target.value } })} />
              <Textarea placeholder="Address" value={settings.contact?.address || ''} onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, address: e.target.value } })} />
              <div className="pt-4 border-t space-y-4">
                <h3 className="font-semibold">Social Media</h3>
                <Input placeholder="Facebook" value={settings.social?.facebook || ''} onChange={(e) => setSettings({ ...settings, social: { ...settings.social, facebook: e.target.value } })} />
                <Input placeholder="Instagram" value={settings.social?.instagram || ''} onChange={(e) => setSettings({ ...settings, social: { ...settings.social, instagram: e.target.value } })} />
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t">
              <Button onClick={handleSaveContact} disabled={saving}><Save className="w-4 h-4 mr-2" /> Save Contact </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="email">
          <div className="bg-card rounded-lg p-6 shadow-sm border border-border space-y-6">
            <h2 className="font-display text-xl font-semibold mb-2">SMTP / Outlook Configuration</h2>
            <div className="space-y-4 max-w-2xl">
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="SMTP Host" value={settings.email?.smtpHost || ''} onChange={(e) => setSettings({ ...settings, email: { ...settings.email, smtpHost: e.target.value } })} />
                <Input placeholder="587" value={settings.email?.smtpPort || ''} onChange={(e) => setSettings({ ...settings, email: { ...settings.email, smtpPort: e.target.value } })} />
              </div>
              <Input placeholder="Email/User" value={settings.email?.smtpUser || ''} onChange={(e) => setSettings({ ...settings, email: { ...settings.email, smtpUser: e.target.value } })} />
              <div className="relative">
                <Input type={showPassword ? "text" : "password"} placeholder="Password" value={settings.email?.smtpPass || ''} onChange={(e) => setSettings({ ...settings, email: { ...settings.email, smtpPass: e.target.value } })} />
                <Button variant="ghost" size="icon" className="absolute right-0 top-0" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</Button>
              </div>
              <Input placeholder="Sender Name" value={settings.email?.senderName || ''} onChange={(e) => setSettings({ ...settings, email: { ...settings.email, senderName: e.target.value } })} />
            </div>
            <div className="flex justify-between pt-6 border-t">
              <Button variant="outline" onClick={handleTestConnection} disabled={testing}><ShieldCheck className="w-4 h-4 mr-2" /> Test </Button>
              <Button onClick={handleSaveEmail} disabled={saving}><Save className="w-4 h-4 mr-2" /> Save Email </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
