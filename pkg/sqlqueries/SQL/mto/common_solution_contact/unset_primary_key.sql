UPDATE mto_common_solution_contact
SET
    is_primary = FALSE,
    modified_by = :modified_by,
    modified_dts = CURRENT_TIMESTAMP
WHERE
    mto_common_solution_key = :key
    AND id <> :id;
