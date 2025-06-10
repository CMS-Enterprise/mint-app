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

-- Remove all existing rows to ensure a clean slate for new constraints
DELETE FROM mto_common_solution_contact;

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
