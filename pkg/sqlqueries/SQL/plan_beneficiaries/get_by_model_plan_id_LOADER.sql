WITH QUERIED_IDS AS (
    /*Translate the input to a table */
    SELECT model_plan_id
    FROM
        JSON_TO_RECORDSET(:paramTableJSON)
        AS x("model_plan_id" UUID) --noqa
)

SELECT
    benes.id,
    benes.model_plan_id,
    benes.beneficiaries,
    benes.beneficiaries_other,
    benes.beneficiaries_note,
    benes.disease_specific_group,
    benes.treat_dual_elligible_different,
    benes.treat_dual_elligible_different_how,
    benes.treat_dual_elligible_different_note,
    benes.exclude_certain_characteristics,
    benes.exclude_certain_characteristics_criteria,
    benes.exclude_certain_characteristics_note,
    benes.number_people_impacted,
    benes.estimate_confidence,
    benes.confidence_note,
    benes.beneficiary_selection_method,
    benes.beneficiary_selection_other,
    benes.beneficiary_selection_note,
    benes.beneficiary_selection_frequency,
    benes.beneficiary_selection_frequency_continually,
    benes.beneficiary_selection_frequency_other,
    benes.beneficiary_selection_frequency_note,
    benes.beneficiary_removal_frequency,
    benes.beneficiary_removal_frequency_continually,
    benes.beneficiary_removal_frequency_other,
    benes.beneficiary_removal_frequency_note,
    benes.beneficiary_overlap,
    benes.beneficiary_overlap_note,
    benes.precedence_rules,
    benes.precedence_rules_yes,
    benes.precedence_rules_no,
    benes.precedence_rules_note,
    benes.created_by,
    benes.created_dts,
    benes.modified_by,
    benes.modified_dts,
    benes.ready_for_review_by,
    benes.ready_for_review_dts,
    benes.ready_for_clearance_by,
    benes.ready_for_clearance_dts,
    benes.status
-- TODO replace with expanded fields

FROM QUERIED_IDS AS qIDs
INNER JOIN plan_beneficiaries AS benes ON benes.model_plan_id = qIDs.model_plan_id;
