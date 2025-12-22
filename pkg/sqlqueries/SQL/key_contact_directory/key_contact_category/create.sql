INSERT INTO key_contact_category (
    id,
    name,
    created_by
) VALUES (
    :id,
    :name,
    :created_by
)
RETURNING
    id,
    name,
    created_by,
    created_dts,
    modified_by,
    modified_dts;
