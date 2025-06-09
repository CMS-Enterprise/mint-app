-- Rename columns
ALTER TABLE mto_common_solution_contact
    RENAME COLUMN email TO mailbox_address;

ALTER TABLE mto_common_solution_contact
    RENAME COLUMN name TO mailbox_title;

-- Change mailbox_address from ZERO_STRING to TEXT
ALTER TABLE mto_common_solution_contact
    ALTER COLUMN mailbox_address TYPE TEXT;

-- Change mailbox_title from ZERO_STRING to TEXT
ALTER TABLE mto_common_solution_contact
    ALTER COLUMN mailbox_title TYPE TEXT;

-- Add user_account_id as a foreign key (nullable)
ALTER TABLE mto_common_solution_contact
    ADD COLUMN user_account_id UUID REFERENCES user_account(id);

-- Add receive_emails field with default true
ALTER TABLE mto_common_solution_contact
    ADD COLUMN receive_emails BOOLEAN NOT NULL DEFAULT TRUE;