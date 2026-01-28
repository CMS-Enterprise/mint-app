-- Backfill IDDOC questionnaire needed field based on trigger conditions
-- Set needed = TRUE where any of the three trigger conditions are met:
-- 1. plan_ops_eval_and_learning.iddoc_support = true
-- 2. INNOVATION or ACO_OS solution exists
-- 3. IDDOC_SUPPORT milestone exists

UPDATE iddoc_questionnaire iq
SET
    needed = TRUE,
    modified_by = iq.created_by,
    modified_dts = CURRENT_TIMESTAMP
WHERE
    needed = FALSE
    AND EXISTS (
    -- Condition 1: OEL iddoc_support = true
        SELECT 1
        FROM plan_ops_eval_and_learning oel
        WHERE
            oel.model_plan_id = iq.model_plan_id
            AND oel.iddoc_support = TRUE

        UNION ALL

        -- Condition 2: INNOVATION or ACO_OS solution selected
        SELECT 1
        FROM mto_solution ms
        WHERE
            ms.model_plan_id = iq.model_plan_id
            AND ms.mto_common_solution_key IN ('INNOVATION', 'ACO_OS')

        UNION ALL

        -- Condition 3: IDDOC_SUPPORT milestone selected
        SELECT 1
        FROM mto_milestone mm
        WHERE
            mm.model_plan_id = iq.model_plan_id
            AND mm.mto_common_milestone_key = 'IDDOC_SUPPORT'
    );

-- Set needed = FALSE where NO conditions are met
UPDATE iddoc_questionnaire iq
SET
    needed = FALSE,
    modified_by = iq.created_by,
    modified_dts = CURRENT_TIMESTAMP
WHERE
    needed = TRUE
    AND NOT EXISTS (
    -- Condition 1: OEL iddoc_support = true
        SELECT 1
        FROM plan_ops_eval_and_learning oel
        WHERE
            oel.model_plan_id = iq.model_plan_id
            AND oel.iddoc_support = TRUE

        UNION ALL

        -- Condition 2: INNOVATION or ACO_OS solution selected
        SELECT 1
        FROM mto_solution ms
        WHERE
            ms.model_plan_id = iq.model_plan_id
            AND ms.mto_common_solution_key IN ('INNOVATION', 'ACO_OS')

        UNION ALL

        -- Condition 3: IDDOC_SUPPORT milestone selected
        SELECT 1
        FROM mto_milestone mm
        WHERE
            mm.model_plan_id = iq.model_plan_id
            AND mm.mto_common_milestone_key = 'IDDOC_SUPPORT'
    );
