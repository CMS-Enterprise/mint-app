UPDATE mto_common_solution_contact
SET is_primary = FALSE
WHERE
    mto_common_solution_key = :key
    AND id <> :id;
