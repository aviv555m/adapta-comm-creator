-- Fix security issues in functions by setting search_path

-- Update handle_new_user function to include proper search path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', NEW.email)
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    display_name = EXCLUDED.display_name;
  
  INSERT INTO public.profile_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Update update_updated_at_column function to include proper search path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Enable RLS on knowledge table if it exists
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'knowledge' AND table_schema = 'public') THEN
    ALTER TABLE public.knowledge ENABLE ROW LEVEL SECURITY;
    
    -- Create RLS policies for knowledge table if they don't exist
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'knowledge' AND policyname = 'Users can view their own knowledge') THEN
      CREATE POLICY "Users can view their own knowledge"
        ON public.knowledge FOR SELECT
        USING (user_id = auth.uid());
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'knowledge' AND policyname = 'Users can insert their own knowledge') THEN
      CREATE POLICY "Users can insert their own knowledge"
        ON public.knowledge FOR INSERT
        WITH CHECK (user_id = auth.uid());
    END IF;
  END IF;
END $$;