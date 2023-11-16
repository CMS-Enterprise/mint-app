SELECT
    id,
    sol_name,
    sol_key,
    treat_as_other,
    created_by,
    created_dts,
    modified_by,
    modified_dts
FROM
    possible_operational_solution
WHERE sol_key = :sol_key;
