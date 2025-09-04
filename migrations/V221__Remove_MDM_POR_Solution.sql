-- Disable (temp) primary contact and audit triggers to not recording below changes
ALTER TABLE mto_solution
DISABLE TRIGGER audit_trigger;
ALTER TABLE mto_common_solution_contact 
DISABLE TRIGGER trg_ensure_primary_contact_MTO;
ALTER TABLE mto_common_solution_contact 
DISABLE TRIGGER audit_trigger;
ALTER TABLE user_view_customization
DISABLE TRIGGER audit_trigger;

WITH poc_table AS (
    SELECT solution.id, "user".common_name, contact.mailbox_title, "user".email, contact.mailbox_address
    FROM mto_solution AS solution
    LEFT JOIN mto_common_solution_contact AS contact
        ON
            solution.mto_common_solution_key = contact.mto_common_solution_key
            AND contact.is_primary
    LEFT JOIN user_account AS "user" ON "user".id = contact.user_id
    WHERE solution.mto_common_solution_key::TEXT = 'MDM_POR' 
)

-- Replace existed MDM_POR from common solution to custom solution
UPDATE mto_solution AS solution
SET 
    mto_common_solution_key = NULL,
    name = 'Master Data Management Program-Organization Relationship',
    type = 'IT_SYSTEM',
    modified_by = '00000001-0001-0001-0001-000000000001', -- System Account
    modified_dts = CURRENT_TIMESTAMP,
    poc_name = 
    COALESCE(poc_table.common_name, poc_table.mailbox_title),
    poc_email = 
    COALESCE(poc_table.email, poc_table.mailbox_address)
FROM poc_table
WHERE
    solution.id = poc_table.id;

-- Create new enum without MDM_POR
CREATE TYPE MTO_COMMON_SOLUTION_NEW_KEY AS ENUM (
    'INNOVATION',
    'ACO_OS',
    'APPS',
    'CDX',
    'CCW',
    'CMS_BOX',
    'CBOSC',
    'CPI_VETTING',
    'EFT',
    'EDFR',
    'GOVDELIVERY',
    'GS',
    'HDR',
    'HPMS',
    'HIGLAS',
    'IPC',
    'IDR',
    'LDG',
    'LV',
    'MARX',
    'OUTLOOK_MAILBOX',
    'QV',
    'RMADA',
    'ARS',
    'CONNECT',
    'LOI',
    'POST_PORTAL',
    'RFA',
    'SHARED_SYSTEMS',
    'BCDA',
    'ISP',
    'MIDS',
    'MDM_NCBP',
    'MODEL_SPACE',
    'CDAC',
    'RREG',
    'FFRDC',
    'ARDS',
    'T_MISS',
    'EPPE',
    'DSEP',
    'AMS',
    'IC_LANDING',
    'RASS',
    'DDPS',
    'OACT',
    'QPP',
    'PAM',
    'NCQA',
    'RMD',
    'MS_FORMS',
    'RESDAC_CMDS',
    'OVERLAPS_OPERATIONS_WORKGROUP'
);

-- Delete all contacts for MDM_POR solution
DELETE FROM mto_common_solution_contact 
WHERE mto_common_solution_key::TEXT = 'MDM_POR';

DELETE FROM mto_common_solution_contractor 
WHERE mto_common_solution_key::TEXT = 'MDM_POR';

DELETE FROM mto_common_solution_system_owner 
WHERE mto_common_solution_key::TEXT = 'MDM_POR';

--Drop (temp) constraints
ALTER TABLE mto_common_solution_contact
DROP CONSTRAINT IF EXISTS mto_common_solution_contact_mto_common_solution_key_fkey;
ALTER TABLE mto_common_solution_contractor
DROP CONSTRAINT IF EXISTS mto_common_solution_contractor_mto_common_solution_key_fkey;
ALTER TABLE mto_common_solution_system_owner
DROP CONSTRAINT IF EXISTS mto_common_solution_system_owner_mto_common_solution_key_fkey;
ALTER TABLE mto_common_milestone_solution_link 
DROP CONSTRAINT IF EXISTS mto_common_milestone_solution_link_mto_common_solution_key_fkey;
ALTER TABLE mto_solution 
DROP CONSTRAINT IF EXISTS mto_solution_mto_common_solution_key_fkey;

-- Delete MDM_POR row from common solutions
DELETE FROM mto_common_solution 
WHERE key::TEXT = 'MDM_POR';
-- Convert all existing solution keys to new enum
ALTER TABLE mto_common_solution
ALTER COLUMN key TYPE MTO_COMMON_SOLUTION_NEW_KEY 
USING (key::TEXT::MTO_COMMON_SOLUTION_NEW_KEY);

ALTER TABLE mto_common_solution_contact
ALTER COLUMN mto_common_solution_key TYPE MTO_COMMON_SOLUTION_NEW_KEY 
USING (mto_common_solution_key::TEXT::MTO_COMMON_SOLUTION_NEW_KEY);

ALTER TABLE mto_common_solution_contractor
ALTER COLUMN mto_common_solution_key TYPE MTO_COMMON_SOLUTION_NEW_KEY 
USING (mto_common_solution_key::TEXT::MTO_COMMON_SOLUTION_NEW_KEY);

ALTER TABLE mto_common_solution_system_owner
ALTER COLUMN mto_common_solution_key TYPE MTO_COMMON_SOLUTION_NEW_KEY 
USING (mto_common_solution_key::TEXT::MTO_COMMON_SOLUTION_NEW_KEY);

ALTER TABLE mto_common_milestone_solution_link
ALTER COLUMN mto_common_solution_key TYPE MTO_COMMON_SOLUTION_NEW_KEY 
USING (mto_common_solution_key::TEXT::MTO_COMMON_SOLUTION_NEW_KEY);

ALTER TABLE mto_solution
ALTER COLUMN mto_common_solution_key TYPE MTO_COMMON_SOLUTION_NEW_KEY 
USING (mto_common_solution_key::TEXT::MTO_COMMON_SOLUTION_NEW_KEY);

ALTER TABLE user_view_customization
ALTER COLUMN solutions DROP DEFAULT;

ALTER TABLE user_view_customization
ALTER COLUMN solutions
TYPE MTO_COMMON_SOLUTION_NEW_KEY[]
USING solutions::TEXT[]::MTO_COMMON_SOLUTION_NEW_KEY[];

ALTER TABLE user_view_customization
ALTER COLUMN solutions SET DEFAULT '{}'::MTO_COMMON_SOLUTION_NEW_KEY[];

-- Drop old enum
DROP TYPE MTO_COMMON_SOLUTION_KEY;
-- Change new enum name to match old enum
ALTER TYPE MTO_COMMON_SOLUTION_NEW_KEY RENAME TO MTO_COMMON_SOLUTION_KEY;

-- Enable primary contact and audit trigger
ALTER TABLE mto_common_solution_contact 
ENABLE TRIGGER trg_ensure_primary_contact_MTO;
ALTER TABLE mto_common_solution_contact
ENABLE TRIGGER audit_trigger;
ALTER TABLE mto_solution
ENABLE TRIGGER audit_trigger;
ALTER TABLE user_view_customization
ENABLE TRIGGER audit_trigger;

-- Add back constraint in mto_common_milestone_solution_link
ALTER TABLE mto_common_solution_contact
ADD CONSTRAINT mto_common_solution_contact_mto_common_solution_key_fkey FOREIGN KEY (mto_common_solution_key)
REFERENCES mto_common_solution (key);

ALTER TABLE mto_common_solution_contractor
ADD CONSTRAINT mto_common_solution_contractor_mto_common_solution_key_fkey FOREIGN KEY (mto_common_solution_key)
REFERENCES mto_common_solution (key);

ALTER TABLE mto_common_solution_system_owner
ADD CONSTRAINT mto_common_solution_system_owner_mto_common_solution_key_fkey FOREIGN KEY (mto_common_solution_key)
REFERENCES mto_common_solution (key);

ALTER TABLE mto_common_milestone_solution_link 
ADD CONSTRAINT mto_common_milestone_solution_link_mto_common_solution_key_fkey FOREIGN KEY (mto_common_solution_key)
REFERENCES mto_common_solution (key);

ALTER TABLE mto_solution 
ADD CONSTRAINT mto_solution_mto_common_solution_key_fkey FOREIGN KEY (mto_common_solution_key)
REFERENCES mto_common_solution (key);
