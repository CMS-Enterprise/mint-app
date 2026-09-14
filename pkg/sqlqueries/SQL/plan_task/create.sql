INSERT INTO plan_task (
    id,
    model_plan_id,
    key,
    state,
    created_by
)
VALUES (
    :id,
    :model_plan_id,
    :key,
    :state,
    :created_by
)
RETURNING
    id,
    model_plan_id,
    key,
    state,
    completed_by,
    completed_dts,
    created_by,
    created_dts,
    modified_by,
    modified_dts;
