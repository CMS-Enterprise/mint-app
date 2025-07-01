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
-- FILL COMMANDS START These will be removed after prod release -------------------------------------------------------------------------
UPDATE mto_common_solution_contact
SET
    mailbox_title = COALESCE(mailbox_title, 'empty string'),
    mailbox_address = GEN_RANDOM_UUID()::TEXT || '@example.com',
    modified_by = '00000001-0001-0001-0001-000000000001', --System Account
    modified_dts = CURRENT_TIMESTAMP
WHERE is_team = TRUE;
-- Set mailbox_title and mailbox_address to NULL, and user_id to a valid UUID for user contacts

-- Insert random users for each non-team contact
INSERT INTO user_account (
    id, username, is_euaid, common_name, locale, email, given_name, family_name, zone_info, has_logged_in
)
SELECT
    GEN_RANDOM_UUID() AS id,
    GEN_RANDOM_UUID()::TEXT AS username,
    FALSE AS is_euaid,
    'Filler User' AS common_name,
    'en-US' AS locale,
    GEN_RANDOM_UUID()::TEXT || '@example.com' AS email,
    'Filler' AS given_name,
    'User' AS family_name,
    'America/New_York' AS zone_info,
    FALSE AS has_logged_in
FROM mto_common_solution_contact
WHERE is_team = FALSE;

-- Assign each non-team contact a user_id from the users just created
WITH user_ids AS (
    SELECT id, ROW_NUMBER() OVER () AS rn
    FROM user_account
    WHERE email LIKE '%@example.com'
),

contacts AS (
    SELECT ctid, ROW_NUMBER() OVER () AS rn
    FROM mto_common_solution_contact
    WHERE is_team = FALSE
)

UPDATE mto_common_solution_contact c
SET
    mailbox_title = NULL,
    mailbox_address = NULL,
    user_id = u.id,
    modified_by = '00000001-0001-0001-0001-000000000001',
    modified_dts = CURRENT_TIMESTAMP
FROM contacts ct
JOIN user_ids u ON ct.rn = u.rn
WHERE c.ctid = ct.ctid;

-- FILLER COMMANDS END These will be removed after prod release-------------------------------------------------------------------------
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

CREATE OR REPLACE FUNCTION ENFORCE_SINGLE_PRIMARY_CONTACT()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_primary THEN
    -- Raise error if another primary already exists
    IF EXISTS (
      SELECT 1 FROM mto_common_solution_contact
      WHERE mto_common_solution_key = NEW.mto_common_solution_key
        AND is_primary = TRUE
        AND id != NEW.id
    ) THEN
      RAISE EXCEPTION 'Only one primary contact is allowed per mto_common_solution_key';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE CONSTRAINT TRIGGER trg_enforce_single_primary_contact
AFTER INSERT OR UPDATE ON mto_common_solution_contact
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW
EXECUTE FUNCTION ENFORCE_SINGLE_PRIMARY_CONTACT();

-- This needs to be part of a separate migration than the definition of contractor table to avoid issues with existing data 
ALTER TYPE TABLE_NAME ADD VALUE 'mto_common_solution_contractor';

CREATE UNIQUE INDEX IF NOT EXISTS uniq_user_id_per_solution_key
ON mto_common_solution_contact (mto_common_solution_key, user_id)
WHERE user_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uniq_mailbox_address_per_solution_key
ON mto_common_solution_contact (mto_common_solution_key, mailbox_address)
WHERE mailbox_address IS NOT NULL;
