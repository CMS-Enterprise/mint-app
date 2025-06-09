-- Rename columns
ALTER TABLE mto_common_solution_contact
RENAME COLUMN email TO mailbox_address;

ALTER TABLE mto_common_solution_contact
RENAME COLUMN name TO mailbox_title;

-- Add user_account_id as a foreign key (nullable)
ALTER TABLE mto_common_solution_contact
ADD COLUMN user_id UUID REFERENCES user_account(id);

-- Add receive_emails field with default true
ALTER TABLE mto_common_solution_contact
ADD COLUMN receive_emails BOOLEAN NOT NULL DEFAULT TRUE;
