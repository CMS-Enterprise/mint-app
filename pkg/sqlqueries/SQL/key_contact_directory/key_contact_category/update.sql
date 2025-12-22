UPDATE key_contact_category
SET
    name = :name,
    modified_by = :modified_by,
    modified_dts = CURRENT_TIMESTAMP
WHERE id = :id
RETURNING
    id,
    name,
    created_by,
    created_dts,
    modified_by,
    modified_dts;
