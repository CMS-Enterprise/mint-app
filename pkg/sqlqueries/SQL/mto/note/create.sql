INSERT INTO mto_milestone_note(
    id,
    mto_milestone_id,
    content,
    created_by
)
VALUES (
    gen_random_uuid(),
    :mto_milestone_id,
    :content,
    :created_by
)
RETURNING
    id,
    mto_milestone_id,
    content,
    created_by,
    created_dts,
    modified_by,
    modified_dts
