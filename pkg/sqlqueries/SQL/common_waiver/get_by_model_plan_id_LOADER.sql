WITH QUERIED_IDS AS (
    /*Translate the input to a table */
    SELECT UNNEST(CAST(:model_plan_ids AS UUID[]))  AS model_plan_id
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
    -- These are convenience fields for context.
    qIDs.model_plan_id,
    waiver.will_use_waiver,
    waiver.not_using_reason,
    suggested_waiver.id AS suggested_waiver_id

FROM common_waiver AS cw
-- CROSS JOIN joins the model plan id to every record, without a specific join condition
CROSS JOIN QUERIED_IDS AS qIDs
LEFT JOIN waiver 
    ON
        cw.id = waiver.common_waiver_id 
        AND qIDs.model_plan_id = waiver.model_plan_id
        /* Note, this will send a 0 value uuid for model_plan_id instead of nil*/
LEFT JOIN suggested_waiver
    ON
        cw.id = suggested_waiver.common_waiver_id 
        AND qIDs.model_plan_id = suggested_waiver.model_plan_id
