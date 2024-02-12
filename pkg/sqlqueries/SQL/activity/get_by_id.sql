SELECT
    id,
    actor_id,
    entity_id,
    activity_type,
    meta_data,
    created_by,
    created_dts,
    modified_by,
    modified_dts
FROM activity
WHERE id = :id;
