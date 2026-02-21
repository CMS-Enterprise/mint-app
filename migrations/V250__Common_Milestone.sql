ALTER TABLE mto_common_milestone
ADD COLUMN id UUID NOT NULL UNIQUE DEFAULT GEN_RANDOM_UUID(),
ADD COLUMN is_archived BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN created_by UUID REFERENCES user_account (id) NOT NULL DEFAULT '00000001-0001-0001-0001-000000000001',
ADD COLUMN created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN modified_by UUID REFERENCES user_account(id),
ADD COLUMN modified_dts TIMESTAMP WITH TIME ZONE;

-- -- update ALL FK relationships before swapping primary key columns
-- -- table list:
-- -- * mto_common_milestone_solution_link
-- -- * mto_milestone
-- -- * mto_suggested_milestone
-- -- * mto_template_milestone

-- -- 1: create the new columns
-- -- start these as nullable, will be fixed later in this migration
ALTER TABLE mto_common_milestone_solution_link
ADD COLUMN mto_common_milestone_id UUID;

ALTER TABLE mto_milestone
ADD COLUMN mto_common_milestone_id UUID;

ALTER TABLE mto_suggested_milestone
ADD COLUMN mto_common_milestone_id UUID;

ALTER TABLE mto_template_milestone
ADD COLUMN mto_common_milestone_id UUID;

-- -- 2: map to the new `id` column on the `mto_common_milestone` table
-- -- disable triggers to prevent audit records from being created for these updates
ALTER TABLE mto_milestone
DISABLE TRIGGER audit_trigger;

ALTER TABLE mto_template_milestone
DISABLE TRIGGER audit_trigger;

-- -- map begins
BEGIN;

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

COMMIT;
-- -- re-enable triggers
ALTER TABLE mto_milestone
ENABLE TRIGGER audit_trigger;

ALTER TABLE mto_template_milestone
ENABLE TRIGGER audit_trigger;

-- -- 3: set the non-null constraints on the new columns on the child tables
ALTER TABLE mto_common_milestone_solution_link
ALTER COLUMN mto_common_milestone_id SET NOT NULL;

ALTER TABLE mto_suggested_milestone
ALTER COLUMN mto_common_milestone_id SET NOT NULL;

ALTER TABLE mto_template_milestone
ALTER COLUMN mto_common_milestone_id SET NOT NULL;

-- -- 4: drop the old FK relationships
ALTER TABLE mto_common_milestone_solution_link
DROP CONSTRAINT mto_common_milestone_solution_lin_mto_common_milestone_key_fkey;

ALTER TABLE mto_milestone
DROP CONSTRAINT mto_milestone_mto_common_milestone_key_fkey;

ALTER TABLE mto_suggested_milestone
DROP CONSTRAINT mto_suggested_milestone_mto_common_milestone_key_fkey;

ALTER TABLE mto_template_milestone
DROP CONSTRAINT mto_template_milestone_mto_common_milestone_key_fkey;

-- -- 5: create the new FK relationships
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

-- -- 6: swap primary key columns
ALTER TABLE mto_common_milestone
DROP CONSTRAINT mto_common_milestone_pkey,
ADD PRIMARY KEY (id);

ALTER TABLE mto_common_milestone_solution_link
DROP CONSTRAINT mto_common_milestone_solution_link_pkey,
ADD PRIMARY KEY (mto_common_milestone_id,mto_common_solution_key);

ALTER TABLE mto_milestone
DROP CONSTRAINT IF EXISTS unique_mto_common_milestone_per_model_plan;

ALTER TABLE mto_milestone
ADD CONSTRAINT unique_mto_common_milestone_per_model_plan UNIQUE (model_plan_id, mto_common_milestone_id);
COMMENT ON CONSTRAINT unique_mto_common_milestone_per_model_plan ON mto_milestone IS 'Constraint to ensure that each common milestone can be linked to a model plan only once';

DROP INDEX IF EXISTS uniq_template_common_milestone;
CREATE UNIQUE INDEX IF NOT EXISTS uniq_template_common_milestone
ON mto_template_milestone (template_id, mto_common_milestone_id);
COMMENT ON INDEX uniq_template_common_milestone IS 'Constraint to ensure that each common milestone can be linked to a template only once';
