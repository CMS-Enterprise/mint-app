INSERT INTO activity(
    id,
    actor_id,
    entity_id,
    activity_type,
    meta_data,
    created_by
)
VALUES (
    :id,
    :actor_id,
    :entity_id,
    :activity_type,
    :meta_data,
    :created_by
)
RETURNING
    id,
    actor_id,
    entity_id,
    activity_type,
    meta_data,
    created_by,
    created_dts,
    modified_by,
    modified_dts;
