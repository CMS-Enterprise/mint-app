INSERT INTO activity(
        id,
        actor_id,
        entitity_id,
        activity_type,
        created_by,
    )
VALUES (
        :id,
        :actor_id,
        :entitity_id,
        :activity_type,
        :created_by,
    );
RETURNING id,
    actor_id,
    entitity_id,
    activity_type,
    created_by,
    created_dts,
    modified_by,
    modified_dts
