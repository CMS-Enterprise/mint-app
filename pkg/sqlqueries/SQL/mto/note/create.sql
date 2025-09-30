INSERT INTO mto_milestone_note(
    id,
    milestone_id,
    content,
    created_by
)
VALUES (
    gen_random_uuid(),
    :milestone_id,
    :content,
    :created_by
)
RETURNING
    id,
    milestone_id,
    content,
    created_by,
    created_dts,
    modified_by,
    modified_dts
