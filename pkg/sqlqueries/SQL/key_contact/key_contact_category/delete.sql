DELETE FROM key_contact_category
WHERE id = :id
RETURNING
    id,
    category,
    created_by,
    created_dts,
    modified_by,
    modified_dts;
