UPDATE plan_task
SET
    status = :status,
    completed_by = :completed_by,
    completed_dts = :completed_dts,
    modified_by = :modified_by,
    modified_dts = CURRENT_TIMESTAMP
WHERE
    plan_task.id = :id
RETURNING
    id,
    model_plan_id,
    key,
    status,
    completed_by,
    completed_dts,
    created_by,
    created_dts,
    modified_by,
    modified_dts;
