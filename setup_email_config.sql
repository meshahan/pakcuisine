-- Create email_configurations table for SMTP settings
CREATE TABLE IF NOT EXISTS public.email_configurations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    smtp_host TEXT NOT NULL,
    smtp_port INTEGER NOT NULL DEFAULT 587,
    smtp_user TEXT NOT NULL,
    smtp_pass TEXT NOT NULL, -- Note: Store encrypted or in a secure environment in production
    sender_name TEXT DEFAULT 'Pak Cuisine',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.email_configurations ENABLE ROW LEVEL SECURITY;

-- Allow Admin only access
CREATE POLICY "Admins can manage email config" 
ON public.email_configurations
FOR ALL 
TO authenticated
USING (auth.jwt() ->> 'email' IN ('meshahan@gmail.com')); -- Replace or adjust with your admin role logic

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_email_config_updated_at
    BEFORE UPDATE ON email_configurations
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
