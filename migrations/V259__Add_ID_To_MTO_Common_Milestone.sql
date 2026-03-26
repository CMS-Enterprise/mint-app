-- -- 1: create the new columns to mto_common_milestone and related tables
ALTER TABLE mto_common_milestone
ADD COLUMN id UUID NOT NULL UNIQUE DEFAULT GEN_RANDOM_UUID(),
ADD COLUMN is_archived BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN created_by UUID REFERENCES user_account (id) NOT NULL DEFAULT '00000001-0001-0001-0001-000000000001',
ADD COLUMN created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN modified_by UUID REFERENCES user_account(id),
ADD COLUMN modified_dts TIMESTAMP WITH TIME ZONE;

-- -- related table list:
-- -- * mto_common_milestone_solution_link
-- -- * mto_milestone
-- -- * mto_suggested_milestone
-- -- * mto_template_milestone
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

-- -- Add new table name to support audit configuration for the mto_common_milestone table
ALTER TYPE table_name ADD VALUE 'mto_common_milestone';
