-- Backfill the PREPARE_FOR_CLEARANCE task for model plans created before this task existed. It
-- always starts UPCOMING; the resolver layer computes whether it should display as TO_DO based on
-- proximity to the plan's internal clearance start date (see PrepareForClearanceTaskStatus in
-- pkg/models/plan_task.go), since that trigger depends on elapsed time rather than a stored event.
INSERT INTO plan_task (
    id,
    model_plan_id,
    key,
    status,
    created_by
)
SELECT
    GEN_RANDOM_UUID() AS id,
    mp.id AS model_plan_id,
    'PREPARE_FOR_CLEARANCE'::PLAN_TASK_KEY AS key,
    'UPCOMING'::PLAN_TASK_STATUS AS status,
    '00000001-0001-0001-0001-000000000001'::UUID AS created_by
FROM model_plan mp
WHERE NOT EXISTS (
    SELECT 1
    FROM plan_task pt
    WHERE
        pt.model_plan_id = mp.id
        AND pt.key = 'PREPARE_FOR_CLEARANCE'::PLAN_TASK_KEY
);
