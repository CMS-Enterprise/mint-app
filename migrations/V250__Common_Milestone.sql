ALTER TABLE mto_common_milestone
ADD COLUMN IF NOT EXISTS is_archived BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE mto_common_milestone
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES user_account (id) NOT NULL DEFAULT '00000001-0001-0001-0001-000000000001';

ALTER TABLE mto_common_milestone
ADD COLUMN IF NOT EXISTS created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW();

ALTER TABLE mto_common_milestone
ADD COLUMN IF NOT EXISTS modified_by UUID REFERENCES user_account (id) NOT NULL DEFAULT '00000001-0001-0001-0001-000000000001';

ALTER TABLE mto_common_milestone
ADD COLUMN IF NOT EXISTS modified_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW();

ALTER TABLE mto_common_milestone
ADD COLUMN IF NOT EXISTS id UUID NOT NULL DEFAULT GEN_RANDOM_UUID();

-- update ALL FK relationships before swapping primary key columns
-- table list:
-- * mto_common_milestone_solution_link
-- * mto_milestone
-- * mto_suggested_milestone
-- * mto_template_milestone

-- 1: create the new columns
-- start these as nullable, will be fixed later in this migration
ALTER TABLE mto_common_milestone_solution_link
ADD COLUMN IF NOT EXISTS mto_common_milestone_id UUID;

ALTER TABLE mto_milestone
ADD COLUMN IF NOT EXISTS mto_common_milestone_id UUID;

ALTER TABLE mto_suggested_milestone
ADD COLUMN IF NOT EXISTS mto_common_milestone_id UUID;

ALTER TABLE mto_template_milestone
ADD COLUMN IF NOT EXISTS mto_common_milestone_id UUID;

-- 2: map to the new `id` column on the `mto_common_milestone` table
UPDATE mto_common_milestone_solution_link child
SET mto_common_milestone_id = parent.id
FROM mto_common_milestone parent
WHERE child.mto_common_milestone_key = parent.key;

UPDATE mto_milestone child
SET mto_common_milestone_id = parent.id
FROM mto_common_milestone parent
WHERE child.mto_common_milestone_key = parent.key;

UPDATE mto_suggested_milestone child
SET mto_common_milestone_id = parent.id
FROM mto_common_milestone parent
WHERE child.mto_common_milestone_key = parent.key;

UPDATE mto_template_milestone child
SET mto_common_milestone_id = parent.id
FROM mto_common_milestone parent
WHERE child.mto_common_milestone_key = parent.key;

-- 3: set the non-null constraints on the new columns on the child tables
ALTER TABLE mto_common_milestone_solution_link
ALTER COLUMN mto_common_milestone_id SET NOT NULL;

ALTER TABLE mto_milestone
ALTER COLUMN mto_common_milestone_id SET NOT NULL;

ALTER TABLE mto_suggested_milestone
ALTER COLUMN mto_common_milestone_id SET NOT NULL;

ALTER TABLE mto_template_milestone
ALTER COLUMN mto_common_milestone_id SET NOT NULL;

-- 4: drop the old FK relationships
ALTER TABLE mto_common_milestone_solution_link
DROP CONSTRAINT mto_common_milestone_solution_lin_mto_common_milestone_key_fkey;

ALTER TABLE mto_milestone
DROP CONSTRAINT mto_milestone_mto_common_milestone_key_fkey;

ALTER TABLE mto_suggested_milestone
DROP CONSTRAINT mto_suggested_milestone_mto_common_milestone_key_fkey;

ALTER TABLE mto_template_milestone
DROP CONSTRAINT mto_template_milestone_mto_common_milestone_key_fkey;

-- 5: create the new FK relationships
ALTER TABLE mto_common_milestone_solution_link
ADD CONSTRAINT mto_common_milestone_solution_link_mto_common_milestone_id_fkey
FOREIGN KEY (mto_common_milestone_id) REFERENCES mto_common_milestone (id);

ALTER TABLE mto_milestone
ADD CONSTRAINT mto_milestone_mto_common_milestone_id_fkey
FOREIGN KEY (mto_common_milestone_id) REFERENCES mto_common_milestone (id);

ALTER TABLE mto_suggested_milestone
ADD CONSTRAINT mto_suggested_milestone_mto_common_milestone_id_fkey
FOREIGN KEY (mto_common_milestone_id) REFERENCES mto_common_milestone (id);

ALTER TABLE mto_template_milestone
ADD CONSTRAINT mto_template_milestone_mto_common_milestone_id_fkey
FOREIGN KEY (mto_common_milestone_id) REFERENCES mto_common_milestone (id);


ALTER TABLE mto_common_milestone
DROP CONSTRAINT mto_common_milestone_pkey;

ALTER TABLE mto_common_milestone
ADD PRIMARY KEY (id);
