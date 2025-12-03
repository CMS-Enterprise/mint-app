UPDATE key_contact_category
SET
    category = :category,
    modified_by = :modified_by,
    modified_dts = CURRENT_TIMESTAMP
WHERE id = :id
RETURNING
    id,
    category,
    created_by,
    created_dts,
    modified_by,
    modified_dts;
