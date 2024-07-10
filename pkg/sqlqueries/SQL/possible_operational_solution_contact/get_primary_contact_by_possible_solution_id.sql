SELECT
    id,
    possible_operational_solution_id,
    name,
    email,
    role,
    is_primary,
    created_by,
    created_dts,
    modified_by,
    modified_dts
FROM possible_operational_solution_contact
WHERE
    possible_operational_solution_id = :possible_operational_solution_id
    AND is_primary = TRUE;
