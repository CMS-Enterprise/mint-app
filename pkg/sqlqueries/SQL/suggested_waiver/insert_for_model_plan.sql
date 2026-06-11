-- Insert a suggested_waiver row for every common_waiver that should be suggested
-- for the given model plan, based on the current waiver_assessment_survey answers.
--
-- A waiver is suggested when any of these are true --
--   - survey_question_field IS NULL (no mapping set yet -- always suggest), OR
--   - there is no survey row yet (suggest all by default), OR
--   - the mapped survey field is NULL (question unanswered -- keep suggesting), OR
--   - the mapped survey field is TRUE (model explicitly needs this waiver type).
--
-- common_waiver.survey_question_field stores which waiver_assessment_survey boolean
-- column drives each waiver. The CASE below evaluates that column to decide whether
-- to suggest the waiver based on the survey answer.
--
-- TODO -- Populate common_waiver.survey_question_field via a migration once CMS
-- provides the real waiver-to-question mappings. Until then, survey_question_field
-- is NULL for all rows and every waiver is suggested unconditionally.
-- The WHEN clauses below are illustrative examples of the intended pattern
-- (one per survey section -- Medicare payment, Program/Medicare BE, Medicaid payment).
INSERT INTO suggested_waiver (
    id,
    model_plan_id,
    common_waiver_id,
    created_by
)
SELECT
    GEN_RANDOM_UUID() AS id,
    mp.id AS model_plan_id,
    cw.id AS common_waiver_id,
    ua.id AS created_by
FROM model_plan mp
CROSS JOIN common_waiver cw
JOIN user_account ua ON ua.id = :created_by
LEFT JOIN waiver_assessment_survey s ON s.model_plan_id = mp.id
WHERE
    mp.id = :model_plan_id
    AND (
        cw.survey_question_field IS NULL
        OR s.id IS NULL
        OR CASE cw.survey_question_field
        -- Example -- Medicare payment waiver triggered by page-3 question
            WHEN 'modifies_medicare_savings_programs'
                THEN s.modifies_medicare_savings_programs IS NULL OR s.modifies_medicare_savings_programs
            -- Example -- Program/Medicare BE waiver triggered by page-4 question
            WHEN 'impacts_site_of_care_payments'
                THEN s.impacts_site_of_care_payments IS NULL OR s.impacts_site_of_care_payments
            -- Example -- Medicaid payment waiver triggered by page-5 question
            WHEN 'impacts_medicaid_only_beneficiaries'
                THEN s.impacts_medicaid_only_beneficiaries IS NULL OR s.impacts_medicaid_only_beneficiaries
            ELSE TRUE
        END
    )
ON CONFLICT (model_plan_id, common_waiver_id) DO NOTHING
RETURNING
    id,
    model_plan_id,
    common_waiver_id,
    created_by,
    created_dts,
    modified_by,
    modified_dts;
