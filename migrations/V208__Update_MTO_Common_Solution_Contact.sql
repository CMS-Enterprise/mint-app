-- Remove old columns
ALTER TABLE mto_common_solution_contact
DROP COLUMN IF EXISTS email;

ALTER TABLE mto_common_solution_contact
DROP COLUMN IF EXISTS name;

-- Add new columns
ALTER TABLE mto_common_solution_contact
ADD COLUMN mailbox_title ZERO_STRING NULL,
ADD COLUMN mailbox_address ZERO_STRING NULL;

-- Add user_id as a foreign key (nullable)
ALTER TABLE mto_common_solution_contact
ADD COLUMN user_id UUID REFERENCES user_account(id);

-- Add receive_emails field with default true
ALTER TABLE mto_common_solution_contact
ADD COLUMN receive_emails BOOLEAN NOT NULL DEFAULT TRUE;

-- TODO before merging in feature branch remove this filler data and run drop below 
-- FILL COMMANDS
UPDATE mto_common_solution_contact
SET
    mailbox_title = COALESCE(mailbox_title, 'empty string'),
    mailbox_address = COALESCE(mailbox_address, 'empty string'),
    modified_by = '00000001-0001-0001-0001-000000000001', --System Account
    modified_dts = CURRENT_TIMESTAMP
WHERE is_team = TRUE;
-- Set mailbox_title and mailbox_address to NULL, and user_id to a valid UUID for user contacts
-- Replace '00000000-0000-0000-0000-000000000000' with a real user_account.id as appropriate
UPDATE mto_common_solution_contact
SET
    mailbox_title = NULL,
    mailbox_address = NULL,
    user_id = '00000000-0000-0000-0000-000000000000',
    modified_by = '00000001-0001-0001-0001-000000000001', --System Account
    modified_dts = CURRENT_TIMESTAMP
WHERE is_team = FALSE;
-- FILLER COMMANDS END
-- TODO remove after feature branch merge
-- Remove all existing rows to ensure a clean slate for new constraints
-- ALTER TABLE mto_common_solution_contact DISABLE TRIGGER trg_ensure_primary_contact_MTO;
-- DELETE FROM mto_common_solution_contact;
-- ALTER TABLE mto_common_solution_contact ENABLE TRIGGER trg_ensure_primary_contact_MTO;

-- constraint for having team or user account
-- Ensure that either mailbox_address and mailbox_title are set for team contacts,
-- or user_id is set for individual user contacts, but not both
-- and that is_team is set accordingly
ALTER TABLE mto_common_solution_contact
ADD CONSTRAINT contact_mailbox_or_user_account
CHECK (
    (mailbox_address IS NOT NULL AND mailbox_title IS NOT NULL AND user_id IS NULL AND is_team = TRUE)
    OR
    (mailbox_address IS NULL AND mailbox_title IS NULL AND user_id IS NOT NULL AND is_team = FALSE)
);

DROP INDEX idx_unique_primary_contact_per_mto_common_solution;

-- Couldn't get this to work, so leaving it commented out for now for future reference
-- CREATE OR REPLACE FUNCTION enforce_single_primary_contact()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   IF NEW.is_primary THEN
--     -- Raise error if another primary already exists
--     IF EXISTS (
--       SELECT 1 FROM mto_common_solution_contact
--       WHERE mto_common_solution_key = NEW.mto_common_solution_key
--         AND is_primary = TRUE
--         AND id != NEW.id
--     ) THEN
--       RAISE EXCEPTION 'Only one primary contact is allowed per mto_common_solution_key';
--     END IF;
--   END IF;

--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

-- CREATE CONSTRAINT TRIGGER trg_enforce_single_primary_contact
--     AFTER INSERT OR UPDATE ON mto_common_solution_contact
--     DEFERRABLE INITIALLY IMMEDIATE
--     FOR EACH ROW
--     EXECUTE FUNCTION enforce_single_primary_contact();
