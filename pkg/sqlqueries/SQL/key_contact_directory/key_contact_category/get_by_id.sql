SELECT
    id,
    name,
    created_by,
    created_dts,
    modified_by,
    modified_dts
FROM key_contact_category
WHERE id = :id;
