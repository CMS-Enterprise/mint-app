WITH previous AS (
    SELECT state
    FROM plan_task
    WHERE model_plan_id = :model_plan_id AND key = :key
),

target AS (
    -- Bind each value exactly once, with explicit casts, so Postgres never has to infer a
    -- parameter's type from a bare literal comparison inside the WHERE clause below.
    SELECT
        CAST(:state AS PLAN_TASK_STATE) AS state,
        CAST(:completed_by AS UUID) AS completed_by,
        CAST(:completed_dts AS TIMESTAMPTZ) AS completed_dts,
        CAST(:modified_by AS UUID) AS modified_by,
        CAST(:target_is_complete AS BOOLEAN) AS target_is_complete
)

UPDATE plan_task
SET
    state = target.state,
    completed_by = target.completed_by,
    completed_dts = target.completed_dts,
    modified_by = target.modified_by,
    modified_dts = CURRENT_TIMESTAMP
FROM target
WHERE
    plan_task.model_plan_id = :model_plan_id
    AND plan_task.key = :key
    -- completed_by/completed_dts are freshly generated on every call when the target state is
    -- COMPLETE, so comparing them directly against the stored values would never be a match
    -- (skip). Instead, mirror the original Go check - a row is already correct if its state
    -- matches the target state AND its completion metadata is already in the right shape (both
    -- set for COMPLETE, both null otherwise) - regardless of what new completed_by/completed_dts
    -- values were computed.
    AND NOT (
        plan_task.state = target.state
        AND (
            (target.target_is_complete AND plan_task.completed_by IS NOT NULL AND plan_task.completed_dts IS NOT NULL)
            OR (NOT target.target_is_complete AND plan_task.completed_by IS NULL AND plan_task.completed_dts IS NULL)
        )
    )
RETURNING
    plan_task.id,
    plan_task.model_plan_id,
    plan_task.key,
    plan_task.state,
    plan_task.completed_by,
    plan_task.completed_dts,
    plan_task.created_by,
    plan_task.created_dts,
    plan_task.modified_by,
    plan_task.modified_dts,
    (SELECT state FROM previous) AS previous_state;
