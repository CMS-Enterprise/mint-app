-- Add the new value to the tag_type enum
ALTER TYPE tag_type ADD VALUE IF NOT EXISTS 'MTO_COMMON_SOLUTION';

-- 1. Add the new UUID column, allowing NULLs for now
ALTER TABLE mto_common_solution
ADD COLUMN id UUID;

-- 2. Populate the column for existing rows
UPDATE mto_common_solution
SET id = gen_random_uuid()
WHERE id IS NULL;

-- 3. Set the column to NOT NULL
ALTER TABLE mto_common_solution
ALTER COLUMN id SET NOT NULL;

-- 4. (Optional) Add a unique constraint or make it the primary key if needed
ALTER TABLE mto_common_solution
ADD CONSTRAINT mto_common_solution_id_unique UNIQUE (id);
