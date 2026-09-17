/*
Backfill a WAIVER_ASSESSMENT_SURVEY plan_task row for every existing model plan.
All existing plans start at TO_DO since no survey data exists yet.
*/
INSERT INTO plan_task (
    id,
    model_plan_id,
    key,
    status,
    created_by
)
SELECT
    GEN_RANDOM_UUID() AS task_id,
    mp.id,
    'WAIVER_ASSESSMENT_SURVEY'::PLAN_TASK_KEY,
    'TO_DO'::PLAN_TASK_STATUS,
    '00000001-0001-0001-0001-000000000001'::UUID
FROM model_plan mp
WHERE NOT EXISTS (
    SELECT 1
    FROM plan_task pt
    WHERE
        pt.model_plan_id = mp.id
        AND pt.key = 'WAIVER_ASSESSMENT_SURVEY'::PLAN_TASK_KEY
);
