-- Unset the current primary contact for the given possible_operational_solution_id
UPDATE possible_operational_solution_contact
SET
    is_primary = FALSE,
    modified_by = :modified_by,
    modified_dts = now()
WHERE
    possible_operational_solution_id = :solution_id
    AND is_primary = TRUE
RETURNING id;
