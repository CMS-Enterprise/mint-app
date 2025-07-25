SELECT
    id,
    name,
    key,
    type,
    subjects,
    filter_view
FROM
    mto_common_solution
WHERE id = :id;
