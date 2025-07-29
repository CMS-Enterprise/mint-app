-- Add new tag type for MTO common solutions
ALTER TYPE tag_type ADD VALUE 'MTO_COMMON_SOLUTION';

/* 
  Add the new UUID/id column. This is used to allow MTO common solutions to use the entity_uuid on tagged content, same as user_account.
  Previously operational solutions were using int as id, moving to UUID allows for better compatibility with other tables 
*/
ALTER TABLE mto_common_solution
ADD COLUMN id UUID;

-- Adding a UUID id all MTO common solutions
UPDATE mto_common_solution
SET id = gen_random_uuid()
WHERE id IS NULL;

-- Set the column to NOT NULL
ALTER TABLE mto_common_solution
ALTER COLUMN id SET NOT NULL;

-- Add a unique constraint to the id column
ALTER TABLE mto_common_solution
ADD CONSTRAINT mto_common_solution_id_unique UNIQUE (id);
