ALTER TYPE PLAN_TASK_KEY ADD VALUE 'SIX_PAGER';
COMMIT;

-- Backfill the SIX_PAGER task for model plans created before this task existed. A plan whose
-- TWO_PAGER task is already COMPLETE starts SIX_PAGER at TO_DO (already activated); all other plans
-- start at UPCOMING, matching the trigger in PlanTaskMarkComplete that activates SIX_PAGER once
-- TWO_PAGER is marked complete.
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
    'SIX_PAGER'::PLAN_TASK_KEY AS key,
    (
        CASE
            WHEN EXISTS (
                SELECT 1
                FROM plan_task pt
                WHERE
                    pt.model_plan_id = mp.id
                    AND pt.key = 'TWO_PAGER'::PLAN_TASK_KEY
                    AND pt.status = 'COMPLETE'::PLAN_TASK_STATUS
            ) THEN 'TO_DO'
            ELSE 'UPCOMING'
        END
    )::PLAN_TASK_STATUS AS status,
    '00000001-0001-0001-0001-000000000001'::UUID AS created_by
FROM model_plan mp
WHERE NOT EXISTS (
    SELECT 1
    FROM plan_task pt
    WHERE
        pt.model_plan_id = mp.id
        AND pt.key = 'SIX_PAGER'::PLAN_TASK_KEY
);
