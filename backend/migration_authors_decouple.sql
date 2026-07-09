-- ============================================================
-- Migration: Decouple Authors from Users (Production Safe)
-- ============================================================

BEGIN;

DO $$
DECLARE
  fk_name text;
BEGIN
  -- 1. Find the specific foreign key constraint on public.authors.id referencing public.users.id
  SELECT tc.constraint_name INTO fk_name
  FROM information_schema.table_constraints AS tc
  JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
  JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
  WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public'
    AND tc.table_name = 'authors'
    AND kcu.column_name = 'id'
    AND ccu.table_schema = 'public'
    AND ccu.table_name = 'users'
    AND ccu.column_name = 'id'
  LIMIT 1;

  -- 2. Drop the foreign key constraint safely
  IF fk_name IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.authors DROP CONSTRAINT ' || quote_ident(fk_name);
  END IF;

  -- 3. Modify `id` to auto-generate UUIDs since it's no longer strictly 1:1 with users
  ALTER TABLE public.authors ALTER COLUMN id SET DEFAULT gen_random_uuid();

  -- 4. Add `name` column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'authors' AND column_name = 'name'
  ) THEN
    ALTER TABLE public.authors ADD COLUMN name TEXT NOT NULL DEFAULT 'Unknown Author';
    ALTER TABLE public.authors ALTER COLUMN name DROP DEFAULT;
  END IF;

  -- 5. Add `user_id` to optionally link a real authenticated user
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'authors' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE public.authors ADD COLUMN user_id UUID REFERENCES public.users(id) ON DELETE SET NULL;
  END IF;

  -- 6. Ensure an author profile can only be linked to one user account at most
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conrelid = 'public.authors'::regclass AND conname = 'authors_user_id_key'
  ) THEN
    ALTER TABLE public.authors ADD CONSTRAINT authors_user_id_key UNIQUE (user_id);
  END IF;
  
END $$;

-- 7. Add an index for quick lookups by user_id
CREATE INDEX IF NOT EXISTS idx_authors_user_id ON public.authors(user_id);

COMMIT;
