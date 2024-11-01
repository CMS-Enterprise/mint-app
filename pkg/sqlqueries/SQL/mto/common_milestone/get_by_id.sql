SELECT
    id,
    name,
    key,
    category_name,
    sub_category_name,
    description,
    facilitated_by_role,
    created_by,
    created_dts,
    modified_by,
    modified_dts
FROM mto_common_milestone
WHERE  id = :id;
