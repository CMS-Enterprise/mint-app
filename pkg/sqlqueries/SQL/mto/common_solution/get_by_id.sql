SELECT
    id,
    name,
    key,
    type,
    description,
    created_by,
    created_dts,
    modified_by,
    modified_dts
FROM mto_common_solution
WHERE  id = :id;
