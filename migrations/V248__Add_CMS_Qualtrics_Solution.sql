-- Disable the trigger to avoid cache lookup issues
ALTER TABLE mto_common_solution_contact DISABLE TRIGGER trg_ensure_primary_contact_mto;

-- Drop the trigger
DROP TRIGGER IF EXISTS trg_ensure_primary_contact_mto ON mto_common_solution_contact;

-- Drop the function
DROP FUNCTION IF EXISTS ensure_primary_contact_mto;

-- Add CMS_QUALTRICS to the ENUM type
ALTER TYPE MTO_COMMON_SOLUTION_KEY ADD VALUE 'CMS_QUALTRICS';

COMMIT;

-- Recreate the function
CREATE OR REPLACE FUNCTION ensure_primary_contact_mto()
RETURNS TRIGGER AS $$
DECLARE
  sol_key MTO_COMMON_SOLUTION_KEY;
BEGIN
  -- Determine the appropriate key based on the trigger event
  IF TG_OP = 'DELETE' THEN
    sol_key := OLD.mto_common_solution_key;
  ELSE
    sol_key := NEW.mto_common_solution_key;
  END IF;

  -- Check if there is at least one primary contact for the solution
  IF NOT EXISTS (
    SELECT 1
    FROM mto_common_solution_contact
    WHERE mto_common_solution_key = sol_key
      AND is_primary = TRUE
  ) THEN
    RAISE EXCEPTION 'At least one primary contact must be assigned for each mto common solution.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger
CREATE TRIGGER trg_ensure_primary_contact_mto
AFTER INSERT OR UPDATE OR DELETE ON mto_common_solution_contact
FOR EACH ROW
EXECUTE FUNCTION ensure_primary_contact_mto();

-- Re-enable the trigger
ALTER TABLE mto_common_solution_contact ENABLE TRIGGER trg_ensure_primary_contact_mto;

-- Insert CMS_QUALTRICS into the mto common solution table
INSERT INTO mto_common_solution("id", "key", "name", "type", "subjects") VALUES
(gen_random_uuid(), 'CMS_QUALTRICS', 'CMS Qualtrics', 'IT_SYSTEM', '{APPLICATIONS_AND_PARTICIPANT_INTERACTION_ACO_AND_KIDNEY_MODELS}');

WITH pocs(SolutionName, SolutionKey, MailboxTitle, MailboxAddress, Role, IsPrimary, IsTeam, ReceiveEmails) AS (
    VALUES

    ('CMS Qualtrics', 'CMS_QUALTRICS', 'MINT Team', 'MINTTeam@cms.hhs.gov', NULL, TRUE, TRUE, TRUE)
)

-- Insert CMS_QUALTRICS contacts into the mto common solution contact table
INSERT INTO mto_common_solution_contact(
    id,
    mto_common_solution_key,
    mailbox_title,
    mailbox_address,
    role,
    is_primary,
    is_team,
    receive_emails,
    created_by,
    created_dts
)

SELECT
    gen_random_uuid() AS id,
    mto_common_solution.key AS mto_common_solution_key,
    pocs.MailboxTitle AS mailbox_title,
    pocs.MailboxAddress AS mailbox_address,
    pocs.Role,
    pocs.IsPrimary AS is_primary,
    pocs.IsTeam AS is_team,
    pocs.ReceiveEmails AS receive_emails,
    '00000001-0001-0001-0001-000000000001' AS created_by, -- System account
    current_timestamp AS created_dts
FROM pocs
INNER JOIN mto_common_solution ON cast(mto_common_solution.key AS TEXT) = pocs.SolutionKey;

-- -- Add MCBS to DATA_TO_MONITOR and DATA_TO_SUPPORT_EVAL milestones
-- INSERT INTO mto_common_milestone_solution_link (mto_common_milestone_key, mto_common_solution_key)
-- VALUES ('DATA_TO_MONITOR', 'MCBS');

-- INSERT INTO mto_common_milestone_solution_link (mto_common_milestone_key, mto_common_solution_key)
-- VALUES ('DATA_TO_SUPPORT_EVAL', 'MCBS');
