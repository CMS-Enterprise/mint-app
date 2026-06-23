WITH QUERIED_IDS AS (
    /*Translate the input to a table */
    SELECT UNNEST(CAST(:ids AS UUID[]))  AS id
)

SELECT
    cw.id,
    cw.name,
    cw.description,
    cw.participation_agreement_language_link,
    cw.cmmi_waiver_point_of_contact,
    cw.waiver_type,
    cw.waiver_focus,
    cw.what_is_waived,
    cw.has_standardization_effort,
    cw.has_claims_data_or_rreg_analysis,
    cw.is_used_in_active_models,
    cw.survey_question_field,
    cw.created_by,
    cw.created_dts,
    cw.modified_by,
    cw.modified_dts,
    -- These fields are used when getting in scope of a model plan.
    CAST(NULL AS UUID) AS model_plan_id,
    CAST(NULL AS BOOLEAN) AS will_use_waiver,
    NULL AS not_using_reason,
    CAST(NULL AS UUID) AS suggested_waiver_id
FROM common_waiver AS cw
INNER JOIN QUERIED_IDS ON cw.id = QUERIED_IDS.id
