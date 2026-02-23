-- Backfill IDDOC questionnaire needed field and migrate existing data from plan_ops_eval_and_learning.
--
-- Step 1: Backfill the needed field based on trigger conditions:
--   1. plan_ops_eval_and_learning.iddoc_support = true
--   2. INNOVATION or ACO_OS solution exists
--   3. IDDOC_SUPPORT milestone exists
--
-- Step 2: Migrate existing IDDOC questionnaire content from plan_ops_eval_and_learning to iddoc_questionnaire.
--   This must run before V255 which drops these columns from plan_ops_eval_and_learning.
--   Records with content get status = IN_PROGRESS and preserve the original modified_by/modified_dts.

UPDATE iddoc_questionnaire iq
SET
    needed = TRUE,
    modified_by = '00000001-0001-0001-0001-000000000001'::UUID, -- MINT System Account
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

-- Step 2: Migrate existing IDDOC content from plan_ops_eval_and_learning to iddoc_questionnaire.
-- Only updates rows where at least one content field was previously filled in.
-- Overwrites modified_by/modified_dts with the source record's values so the real
-- editor is preserved, and sets status = IN_PROGRESS so the task list displays correctly.
UPDATE iddoc_questionnaire iq
SET
    technical_contacts_identified        = oel.technical_contacts_identified,
    technical_contacts_identified_detail = oel.technical_contacts_identified_detail,
    technical_contacts_identified_note   = oel.technical_contacts_identified_note,
    capture_participant_info             = oel.capture_participant_info,
    capture_participant_info_note        = oel.capture_participant_info_note,
    icd_owner                            = oel.icd_owner,
    draft_icd_due_date                   = oel.draft_icd_due_date,
    icd_note                             = oel.icd_note,
    uat_needs                            = oel.uat_needs,
    stc_needs                            = oel.stc_needs,
    testing_timelines                    = oel.testing_timelines,
    testing_note                         = oel.testing_note,
    data_monitoring_file_types           = oel.data_monitoring_file_types::TEXT[]::IDDOC_FILE_TYPE[],
    data_monitoring_file_other           = oel.data_monitoring_file_other,
    data_response_type                   = oel.data_response_type,
    data_response_file_frequency         = oel.data_response_file_frequency,
    data_full_time_or_incremental        = oel.data_full_time_or_incremental::TEXT,
    eft_set_up                           = oel.eft_set_up,
    unsolicited_adjustments_included     = oel.unsolicited_adjustments_included,
    data_flow_diagrams_needed            = oel.data_flow_diagrams_needed,
    produce_benefit_enhancement_files    = oel.produce_benefit_enhancement_files,
    file_naming_conventions              = oel.file_naming_conventions,
    data_monitoring_note                 = oel.data_monitoring_note,
    status                               = 'IN_PROGRESS',
    modified_by                          = COALESCE(oel.modified_by, oel.created_by),
    modified_dts                         = COALESCE(oel.modified_dts, oel.created_dts)
FROM plan_ops_eval_and_learning oel
WHERE
    iq.model_plan_id = oel.model_plan_id
    AND (
        oel.technical_contacts_identified IS NOT NULL OR
        oel.technical_contacts_identified_detail IS NOT NULL OR
        oel.technical_contacts_identified_note IS NOT NULL OR
        oel.capture_participant_info IS NOT NULL OR
        oel.capture_participant_info_note IS NOT NULL OR
        oel.icd_owner IS NOT NULL OR
        oel.draft_icd_due_date IS NOT NULL OR
        oel.icd_note IS NOT NULL OR
        oel.uat_needs IS NOT NULL OR
        oel.stc_needs IS NOT NULL OR
        oel.testing_timelines IS NOT NULL OR
        oel.testing_note IS NOT NULL OR
        oel.data_monitoring_file_types IS NOT NULL OR
        oel.data_monitoring_file_other IS NOT NULL OR
        oel.data_response_type IS NOT NULL OR
        oel.data_response_file_frequency IS NOT NULL OR
        oel.data_full_time_or_incremental IS NOT NULL OR
        oel.eft_set_up IS NOT NULL OR
        oel.unsolicited_adjustments_included IS NOT NULL OR
        oel.data_flow_diagrams_needed IS NOT NULL OR
        oel.produce_benefit_enhancement_files IS NOT NULL OR
        oel.file_naming_conventions IS NOT NULL OR
        oel.data_monitoring_note IS NOT NULL
    );

-- Set needed = FALSE where NO conditions are met
-- (This is for safety, but should already be the default for new records)
UPDATE iddoc_questionnaire iq
SET
    needed = FALSE,
    modified_by = '00000001-0001-0001-0001-000000000001'::UUID, -- MINT System Account
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
