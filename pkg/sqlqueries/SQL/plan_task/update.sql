UPDATE plan_task
SET
    state = :state,
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
    state,
    completed_by,
    completed_dts,
    created_by,
    created_dts,
    modified_by,
    modified_dts;
