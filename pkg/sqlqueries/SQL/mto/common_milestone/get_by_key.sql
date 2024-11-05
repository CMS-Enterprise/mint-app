SELECT
    name,
    key,
    category_name,
    sub_category_name,
    description,
    facilitated_by_role
FROM mto_common_milestone
WHERE  key = :key;
