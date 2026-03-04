SELECT
    id,
    model_plan_id,
    key,
    status,
    completed_by,
    completed_dts,
    created_by,
    created_dts,
    modified_by,
    modified_dts
FROM plan_task
WHERE id = :id;
