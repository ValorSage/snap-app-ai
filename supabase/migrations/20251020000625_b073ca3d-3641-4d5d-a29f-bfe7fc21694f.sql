-- Create table for project state management
CREATE TABLE IF NOT EXISTS public.project_states (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id TEXT NOT NULL UNIQUE,
  file_structure JSONB DEFAULT '[]'::jsonb,
  technologies JSONB DEFAULT '[]'::jsonb,
  installed_libraries JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.project_states ENABLE ROW LEVEL SECURITY;

-- Allow all operations for now (since no auth is implemented)
CREATE POLICY "Enable all access for project_states" 
ON public.project_states 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_project_states_updated_at 
BEFORE UPDATE ON public.project_states 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();