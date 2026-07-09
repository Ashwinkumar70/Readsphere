-- ============================================================
-- Rollback: Re-couple Authors to Users
-- WARNING: This will fail if there are authors that do not exist in public.users
-- ============================================================

BEGIN;

DO $$
BEGIN
  -- 1. Remove the user_id column (cascades and drops the unique constraint and index)
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'authors' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE public.authors DROP COLUMN user_id CASCADE;
  END IF;

  -- 2. Remove the name column
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'authors' AND column_name = 'name'
  ) THEN
    ALTER TABLE public.authors DROP COLUMN name;
  END IF;

  -- 3. Remove the DEFAULT gen_random_uuid() from id
  ALTER TABLE public.authors ALTER COLUMN id DROP DEFAULT;

  -- 4. Re-add the foreign key constraint
  -- (Only succeeds if every author.id exists in users.id)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_type = 'FOREIGN KEY' 
      AND table_schema = 'public' 
      AND table_name = 'authors' 
      AND constraint_name = 'authors_id_fkey'
  ) THEN
    -- In postgres, dropping a column that had an index drops the index too, but we are just re-adding the fk.
    ALTER TABLE public.authors ADD CONSTRAINT authors_id_fkey FOREIGN KEY (id) REFERENCES public.users(id) ON DELETE CASCADE;
  END IF;

END $$;

COMMIT;
