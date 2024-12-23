CREATE TABLE mto_common_solution_contact (
    id UUID PRIMARY KEY NOT NULL,
    mto_common_solution_key MTO_COMMON_SOLUTION_KEY REFERENCES mto_common_solution(key),
    name ZERO_STRING NOT NULL,
    email ZERO_STRING NOT NULL,
    is_team BOOLEAN NOT NULL DEFAULT FALSE,
    role ZERO_STRING NULL,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,


    --META DATA
    created_by UUID NOT NULL REFERENCES user_account(id),
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by UUID REFERENCES user_account(id),
    modified_dts TIMESTAMP WITH TIME ZONE
);

COMMENT ON TABLE mto_common_solution_contact IS 'Table for storing contact information related to MTO common solutions, including team and individual contacts.';

ALTER TABLE mto_common_solution_contact
ADD CONSTRAINT role_required_when_is_team_false CHECK ( (is_team AND role IS NULL) OR (NOT is_team AND role IS NOT NULL));
COMMENT ON CONSTRAINT role_required_when_is_team_false ON mto_common_solution_contact IS 'Ensures that role is required when is_team is false and disallowed when is_team is true.';



WITH CURRENT_POCS AS (
    SELECT
        posc.id,
        pos.sol_key::TEXT::MTO_COMMON_SOLUTION_KEY AS key,
        posc.name,
        posc.email,
        posc.is_team,
        posc.role,
        posc.is_primary,
        posc.created_by,
        posc.created_dts,
        posc.modified_by,
        posc.modified_dts
    FROM possible_operational_solution_contact AS posc
    JOIN possible_operational_solution AS pos ON pos.id = posc.possible_operational_solution_id
)

INSERT INTO public.mto_common_solution_contact
(id, mto_common_solution_key, name, email, is_team, role,is_primary, created_by, created_dts, modified_by, modified_dts)
SELECT 
    id,
    key,
    name,
    email,
    is_team,
    role,
    is_primary,
    created_by,
    created_dts,
    modified_by,
    modified_dts
FROM CURRENT_POCS;


-- Partial Unique Index ensuring only one contact is set at a time
CREATE UNIQUE INDEX idx_unique_primary_contact_per_mto_common_solution
ON mto_common_solution_contact (mto_common_solution_key)
WHERE is_primary = TRUE;
COMMENT ON INDEX idx_unique_primary_contact_per_mto_common_solution IS 'Ensures that only one primary contact is set per MTO common solution.';

-- Trigger Constraint ensuring a primary contact is always set for mto common solutions
CREATE OR REPLACE FUNCTION ENSURE_PRIMARY_CONTACT_MTO()
RETURNS TRIGGER AS $$
DECLARE
  mto_common_solution_key MTO_COMMON_SOLUTION_KEY;
BEGIN

  -- Determine the appropriate key based on the trigger event
  IF TG_OP = 'DELETE' THEN
    mto_common_solution_key := OLD.mto_common_solution_key;
  ELSE
    mto_common_solution_key := NEW.mto_common_solution_key;
  END IF;
  
  -- Check if there is at least one primary contact for the solution
  IF NOT EXISTS (
    SELECT 1
    FROM mto_common_solution_contact
    WHERE mto_common_solution_contact = OLD.mto_common_solution_key
      AND is_primary = TRUE
  ) THEN
    RAISE EXCEPTION 'At least one primary contact must be assigned for each mto common solution.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION ENSURE_PRIMARY_CONTACT_MTO IS 'Trigger function to ensure that at least one primary contact is assigned for each MTO common solution.';

CREATE TRIGGER trg_ensure_primary_contact_MTO
AFTER INSERT OR UPDATE OR DELETE ON mto_common_solution_contact
FOR EACH ROW
EXECUTE FUNCTION ENSURE_PRIMARY_CONTACT_MTO();
COMMENT ON TRIGGER trg_ensure_primary_contact_MTO ON mto_common_solution_contact IS 'Trigger to enforce primary contact assignment rules for MTO common solutions. Note, this requires that a contact for a new solution is first the primary contact, and then subsequent contacts can be added';
