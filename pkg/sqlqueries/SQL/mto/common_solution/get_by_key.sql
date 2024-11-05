SELECT
    name,
    key,
    type,
    description
FROM mto_common_solution
WHERE  key = :key;
