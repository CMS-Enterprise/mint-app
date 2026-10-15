INSERT INTO model_follower_update(
    id,
    model_plan_id,
    content,
    created_by
)
VALUES (
    gen_random_uuid(),
    :model_plan_id,
    :content,
    :created_by
)
RETURNING
    id,
    model_plan_id,
    content,
    created_by,
    created_dts,
    modified_by,
    modified_dts
