-- Fix security warning: Set search_path for function with CASCADE
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$;

-- Recreate trigger
CREATE TRIGGER update_project_states_updated_at 
BEFORE UPDATE ON public.project_states 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();