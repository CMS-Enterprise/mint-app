-- Backfill the PREPARE_FOR_CLEARANCE task for model plans created before this task existed. It
-- always starts UPCOMING and is activated to TO_DO by a scheduled job once the plan is within
-- PrepareForClearanceTriggerDays of its internal clearance start date (see
-- pkg/worker/prepare_for_clearance_job.go), matching how SIX_PAGER is activated.
INSERT INTO plan_task (
    id,
    model_plan_id,
    key,
    state,
    created_by
)
SELECT
    GEN_RANDOM_UUID() AS id,
    mp.id AS model_plan_id,
    'PREPARE_FOR_CLEARANCE'::PLAN_TASK_KEY AS key,
    'UPCOMING'::PLAN_TASK_STATE AS state,
    '00000001-0001-0001-0001-000000000001'::UUID AS created_by
FROM model_plan mp
WHERE NOT EXISTS (
    SELECT 1
    FROM plan_task pt
    WHERE
        pt.model_plan_id = mp.id
        AND pt.key = 'PREPARE_FOR_CLEARANCE'::PLAN_TASK_KEY
);
