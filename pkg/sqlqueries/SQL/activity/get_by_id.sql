SELECT
    id,
    actor_id,
    entitity_id,
    activity_type,
    created_by,
    created_dts,
    modified_by,
    modified_dts
FROM activity
WHERE id = :id;
