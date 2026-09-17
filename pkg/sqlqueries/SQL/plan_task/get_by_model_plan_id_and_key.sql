SELECT
    id,
    model_plan_id,
    key,
    state,
    completed_by,
    completed_dts,
    created_by,
    created_dts,
    modified_by,
    modified_dts
FROM plan_task
WHERE model_plan_id = :model_plan_id AND key = :key;
