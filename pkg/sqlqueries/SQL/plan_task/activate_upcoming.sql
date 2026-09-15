UPDATE plan_task
SET
    state = 'TO_DO',
    modified_by = :modified_by,
    modified_dts = CURRENT_TIMESTAMP
WHERE
    model_plan_id = :model_plan_id
    AND key = :key
    AND state = 'UPCOMING'
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
