-- Remove old columns
ALTER TABLE mto_common_solution_contact
DROP COLUMN IF EXISTS email;

ALTER TABLE mto_common_solution_contact
DROP COLUMN IF EXISTS name;

-- Add new columns
ALTER TABLE mto_common_solution_contact
ADD COLUMN mailbox_title TEXT,
ADD COLUMN mailbox_address TEXT;

-- Add user_id as a foreign key (nullable)
ALTER TABLE mto_common_solution_contact
ADD COLUMN user_id UUID REFERENCES user_account(id);

-- Add receive_emails field with default true
ALTER TABLE mto_common_solution_contact
ADD COLUMN receive_emails BOOLEAN NOT NULL DEFAULT TRUE;

-- Set mailbox_title and mailbox_address to empty string for team contacts
UPDATE mto_common_solution_contact
SET
    mailbox_title = COALESCE(mailbox_title, ''),
    mailbox_address = COALESCE(mailbox_address, ''),
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
