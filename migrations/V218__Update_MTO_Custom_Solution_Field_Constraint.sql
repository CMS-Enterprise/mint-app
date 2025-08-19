ALTER TABLE mto_solution
DROP CONSTRAINT IF EXISTS check_custom_solution_fields;

ALTER TABLE mto_solution
ADD CONSTRAINT check_custom_solution_required_fields CHECK (
    (mto_common_solution_key IS NULL AND ( name IS NOT NULL AND type IS NOT NULL))
    OR (mto_common_solution_key IS NOT NULL AND ( name IS NULL AND type IS NULL AND poc_email IS NULL AND poc_name IS NULL))
);
