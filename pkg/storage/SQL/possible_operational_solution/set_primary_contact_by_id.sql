-- Set the new primary contact
UPDATE possible_operational_solution_contact
SET
    is_primary = TRUE,
    modified_by = :modified_by,
    modified_dts = now()
WHERE
    id = :contact_id
    AND possible_operational_solution_id = :solution_id
