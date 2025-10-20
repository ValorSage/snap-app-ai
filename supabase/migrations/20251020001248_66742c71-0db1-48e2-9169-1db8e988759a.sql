-- Add user_id column to project_states table
ALTER TABLE public.project_states
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Set a default value for existing rows (will be updated when users log in)
UPDATE public.project_states
SET user_id = NULL
WHERE user_id IS NULL;

-- Make user_id NOT NULL after backfill
ALTER TABLE public.project_states
ALTER COLUMN user_id SET NOT NULL;

-- Add default for new rows
ALTER TABLE public.project_states
ALTER COLUMN user_id SET DEFAULT auth.uid();

-- Drop the old permissive policy
DROP POLICY IF EXISTS "Enable all access for project_states" ON public.project_states;

-- Create user-scoped RLS policies
CREATE POLICY "Users can view their own project states"
ON public.project_states
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own project states"
ON public.project_states
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own project states"
ON public.project_states
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own project states"
ON public.project_states
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Create a profiles table for user information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS policies
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Create trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add trigger for updated_at on profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();