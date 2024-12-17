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

ALTER TABLE mto_common_solution_contact
ADD CONSTRAINT role_required_when_is_team_false CHECK ( (is_team AND role IS NULL) OR (NOT is_team AND role IS NOT NULL));



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

-- -- TODO (mto) transfer the primary constraints from possible operational solution contacts as well

-- -- Partial Unique Index ensuring only one contact is set at a time
-- CREATE UNIQUE INDEX idx_unique_primary_contact_per_solution
-- ON mto_common_solution_contact (mto_common_solution_key)
-- WHERE is_primary = TRUE;

-- --TODO (mto) make this work on insert as well
-- -- Trigger Constraint ensuring a primary contact is always set for mto common solutions
-- CREATE OR REPLACE FUNCTION ENSURE_PRIMARY_CONTACT_MTO()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   -- Check if there is at least one primary contact for the solution
--   IF NOT EXISTS (
--     SELECT 1
--     FROM mto_common_solution_contact
--     WHERE mto_common_solution_contact = OLD.mto_common_solution_key
--       AND is_primary = TRUE
--   ) THEN
--     RAISE EXCEPTION 'At least one primary contact must be assigned for each common solution.';
--   END IF;
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

-- CREATE TRIGGER trg_ensure_primary_contact_MTO
-- AFTER UPDATE OR DELETE ON mto_common_solution_contact
-- FOR EACH ROW
-- EXECUTE FUNCTION ENSURE_PRIMARY_CONTACT_MTO();
