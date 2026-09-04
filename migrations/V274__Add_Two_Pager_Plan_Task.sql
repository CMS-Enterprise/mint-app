ALTER TYPE PLAN_TASK_KEY ADD VALUE 'TWO_PAGER';
COMMIT;

-- Backfill the TWO_PAGER task for model plans created before this task existed.
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
    'TWO_PAGER'::PLAN_TASK_KEY AS key,
    'TO_DO'::PLAN_TASK_STATUS AS status,
    '00000001-0001-0001-0001-000000000001'::UUID AS created_by
FROM model_plan mp
WHERE NOT EXISTS (
    SELECT 1
    FROM plan_task pt
    WHERE
        pt.model_plan_id = mp.id
        AND pt.key = 'TWO_PAGER'::PLAN_TASK_KEY
);
