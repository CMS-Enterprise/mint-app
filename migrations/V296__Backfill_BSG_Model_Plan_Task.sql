-- Backfill the BSG_MODEL task for model plans created before this task existed. A plan whose
-- TWO_PAGER task is already COMPLETE starts BSG_MODEL at TO_DO (already activated); all other plans
-- start at UPCOMING, matching the trigger in PlanTaskMarkComplete that activates BSG_MODEL once
-- TWO_PAGER is marked complete.
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
    'BSG_MODEL'::PLAN_TASK_KEY AS key,
    (
        CASE
            WHEN EXISTS (
                SELECT 1
                FROM plan_task pt
                WHERE
                    pt.model_plan_id = mp.id
                    AND pt.key = 'TWO_PAGER'::PLAN_TASK_KEY
                    AND pt.state = 'COMPLETE'::PLAN_TASK_STATE
            ) THEN 'TO_DO'
            ELSE 'UPCOMING'
        END
    )::PLAN_TASK_STATE AS state,
    '00000001-0001-0001-0001-000000000001'::UUID AS created_by
FROM model_plan mp
WHERE NOT EXISTS (
    SELECT 1
    FROM plan_task pt
    WHERE
        pt.model_plan_id = mp.id
        AND pt.key = 'BSG_MODEL'::PLAN_TASK_KEY
);
