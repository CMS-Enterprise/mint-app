-- Rename mto_milestone_id column to milestone_id in mto_milestone_note table
ALTER TABLE mto_milestone_note RENAME COLUMN mto_milestone_id TO milestone_id;

-- Update the audit table config for mto_milestone_note
-- Add the milestone_id to the insert_fields
UPDATE audit.table_config
SET
    fkey_field      = 'milestone_id',
    insert_fields   = '{*,milestone_id}'::TEXT[]
WHERE name = 'mto_milestone_note';
