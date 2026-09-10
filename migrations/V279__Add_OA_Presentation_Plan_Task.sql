ALTER TYPE PLAN_TASK_KEY ADD VALUE 'OA_PRESENTATION';
COMMIT;

-- Backfill the OA_PRESENTATION task for model plans created before this task existed. A plan whose
-- SIX_PAGER task is already COMPLETE starts OA_PRESENTATION at TO_DO (already activated); all other
-- plans start at UPCOMING, matching the trigger in PlanTaskMarkComplete that activates
-- OA_PRESENTATION once SIX_PAGER is marked complete.
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
    'OA_PRESENTATION'::PLAN_TASK_KEY AS key,
    (
        CASE
            WHEN EXISTS (
                SELECT 1
                FROM plan_task pt
                WHERE
                    pt.model_plan_id = mp.id
                    AND pt.key = 'SIX_PAGER'::PLAN_TASK_KEY
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
        AND pt.key = 'OA_PRESENTATION'::PLAN_TASK_KEY
);
