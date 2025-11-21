INSERT INTO key_contact_category (
    id,
    category,
    created_by,
    created_dts
) VALUES (
    :id,
    :category,
    :created_by,
    CURRENT_TIMESTAMP
)
RETURNING
    id,
    category,
    created_by,
    created_dts,
    modified_by,
    modified_dts;
