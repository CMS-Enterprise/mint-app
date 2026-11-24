-- Backfill the APPROVED_ICIP task for model plans created before this task existed.
-- The task starts TO_DO once the model status is INTERNAL_CMMI_CLEARANCE or later (through ENDED),
-- and UPCOMING otherwise. PAUSED and CANCELED plans lose their prior status, so they start UPCOMING.
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
    'APPROVED_ICIP'::PLAN_TASK_KEY AS key,
    (
        CASE
            WHEN mp.status IN (
                'INTERNAL_CMMI_CLEARANCE',
                'CMS_CLEARANCE',
                'HHS_CLEARANCE',
                'OMB_ASRF_CLEARANCE',
                'CLEARED',
                'ANNOUNCED',
                'ACTIVE',
                'ENDED'
            ) THEN 'TO_DO'
            ELSE 'UPCOMING'
        END
    )::PLAN_TASK_STATE AS state,
    '00000001-0001-0001-0001-000000000001'::UUID AS created_by
FROM model_plan AS mp
WHERE NOT EXISTS (
    SELECT 1
    FROM plan_task AS pt
    WHERE
        pt.model_plan_id = mp.id
        AND pt.key = 'APPROVED_ICIP'::PLAN_TASK_KEY
);
