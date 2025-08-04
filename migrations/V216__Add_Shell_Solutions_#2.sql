-- Disable the trigger to avoid cache lookup issues
ALTER TABLE mto_common_solution_contact DISABLE TRIGGER trg_ensure_primary_contact_mto;

-- Drop the trigger
DROP TRIGGER IF EXISTS trg_ensure_primary_contact_mto ON mto_common_solution_contact;

-- Drop the function
DROP FUNCTION IF EXISTS ensure_primary_contact_mto;

-- Add Additional Solutions to the ENUM type
ALTER TYPE MTO_COMMON_SOLUTION_KEY ADD VALUE 'NCQA';
ALTER TYPE MTO_COMMON_SOLUTION_KEY ADD VALUE 'RMD';
ALTER TYPE MTO_COMMON_SOLUTION_KEY ADD VALUE 'MS_FORMS';
ALTER TYPE MTO_COMMON_SOLUTION_KEY ADD VALUE 'RESDAC_CMDS';

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

-- Insert solutions into the mto common solution table
INSERT INTO mto_common_solution("key", "name", "type", "subjects") VALUES
('NCQA', 'National Committee for Quality Assurance (NCQA)', 'OTHER', '{CONTRACT_VEHICLES,QUALITY}'),
('RMD', 'Rapid Measure Development (RMD)', 'CONTRACTOR', '{CONTRACT_VEHICLES,QUALITY}'),
('MS_FORMS', 'Microsoft Forms (MS Forms)', 'IT_SYSTEM', '{APPLICATIONS_AND_PARTICIPANT_INTERACTION_ACO_AND_KIDNEY_MODELS}'),
('RESDAC_CMDS', 'ResDAC CMMI Model Data Sharing Model Participation Data Initiative (ResDAC-CMDS)', 'OTHER', '{DATA}');

-- Insert solution contacts into the mto common solution contact table
WITH pocs(SolutionName, SolutionKey, MailboxTitle, MailboxAddress, Role, IsPrimary, IsTeam, ReceiveEmails) AS (
    VALUES
    ('Rapid Measure Development (RMD)', 'RMD', 'MINT Team', 'MINTTeam@cms.hhs.gov', NULL, TRUE, TRUE, TRUE),
    ('Microsoft Forms (MS Forms)', 'MS_FORMS', 'MINT Team', 'MINTTeam@cms.hhs.gov', NULL, TRUE, TRUE, TRUE),
    ('ResDAC CMMI Model Data Sharing Model Participation Data Initiative (ResDAC-CMDS)', 'RESDAC_CMDS', 'MINT Team', 'MINTTeam@cms.hhs.gov', NULL, TRUE, TRUE, TRUE)
)

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
