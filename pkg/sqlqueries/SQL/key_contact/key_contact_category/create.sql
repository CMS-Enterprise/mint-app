INSERT INTO key_contact_category (
    id,
    category,
    created_by,
) VALUES (
    :id,
    :category,
    :created_by,
)
RETURNING
    id,
    category,
    created_by,
    created_dts,
    modified_by,
    modified_dts;
