ALTER TYPE TABLE_NAME ADD VALUE 'key_contact_category';

-- Create table for key contact category
CREATE TABLE IF NOT EXISTS  key_contact_category (
    id UUID PRIMARY KEY NOT NULL,
    category ZERO_STRING NOT NULL,

    --META DATA
    created_by UUID NOT NULL REFERENCES user_account(id),
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by UUID REFERENCES user_account(id),
    modified_dts TIMESTAMP WITH TIME ZONE
);

COMMENT ON TABLE key_contact_category IS
'Table for storing key contact categories related to subject matter experts.';

-- Ensure that each category has a unique name in key_contact_category
ALTER TABLE key_contact_category
ADD CONSTRAINT uniq_category UNIQUE(category);

ALTER TYPE TABLE_NAME ADD VALUE 'key_contact';

-- Create table for key contact
CREATE TABLE IF NOT EXISTS  key_contact (
    id UUID PRIMARY KEY NOT NULL,
    user_id UUID REFERENCES user_account(id) ON DELETE CASCADE,

    subject_area ZERO_STRING NOT NULL,
    subject_category_id UUID NOT NULL REFERENCES key_contact_category(id) ON DELETE CASCADE,

    mailbox_title ZERO_STRING NULL,
    mailbox_address ZERO_STRING NULL,

    -- Enforce that either user_id is set (individual contact) or both mailbox fields are set (team contact), but not both or neither
    CONSTRAINT contact_mailbox_or_user_account CHECK (
        (
            user_id IS NOT NULL
            AND mailbox_title IS NULL
            AND mailbox_address IS NULL
        )
        OR
        (
            user_id IS NULL
            AND mailbox_title IS NOT NULL
            AND mailbox_address IS NOT NULL
        )
    ),

    --META DATA
    created_by UUID NOT NULL REFERENCES user_account(id),
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by UUID REFERENCES user_account(id),
    modified_dts TIMESTAMP WITH TIME ZONE
);

COMMENT ON TABLE key_contact IS
'Table for storing key contact information related to subject matter experts, including team and individual contacts.';

-- Ensure that same user is set only once for each key_contact_category
CREATE UNIQUE INDEX IF NOT EXISTS uniq_user_id_per_category
ON key_contact (subject_category_id, user_id)
WHERE user_id IS NOT NULL;

-- Ensure that same mailbox is set only once for each key_contact_category
CREATE UNIQUE INDEX IF NOT EXISTS uniq_mailbox_address_per_category
ON key_contact (subject_category_id, mailbox_address)
WHERE mailbox_address IS NOT NULL;
