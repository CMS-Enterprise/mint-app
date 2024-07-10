WITH QUERIED_IDS AS (
    /*Translate the input to a table */
    SELECT model_plan_id
    FROM
        JSON_TO_RECORDSET(:paramTableJSON)
        AS x("model_plan_id" UUID) --noqa
)

SELECT
    plan_basics.id,
    plan_basics.model_plan_id,
    plan_basics.demo_code,
    plan_basics.ams_model_id,
    plan_basics.model_category,
    plan_basics.additional_model_categories,
    plan_basics.cms_centers,
    plan_basics.cmmi_groups,
    plan_basics.model_type,
    plan_basics.model_type_other,
    plan_basics.problem,
    plan_basics.goal,
    plan_basics.test_interventions,
    plan_basics.note,
    plan_basics.complete_icip,
    plan_basics.clearance_starts,
    plan_basics.clearance_ends,
    plan_basics.announced,
    plan_basics.applications_starts,
    plan_basics.applications_ends,
    plan_basics.performance_period_starts,
    plan_basics.performance_period_ends,
    plan_basics.wrap_up_ends,
    plan_basics.high_level_note,
    plan_basics.phased_in,
    plan_basics.phased_in_note,
    plan_basics.created_by,
    plan_basics.created_dts,
    plan_basics.modified_by,
    plan_basics.modified_dts,
    plan_basics.ready_for_review_by,
    plan_basics.ready_for_review_dts,
    plan_basics.ready_for_clearance_by,
    plan_basics.ready_for_clearance_dts,
    plan_basics.status
FROM QUERIED_IDS AS qIDs
INNER JOIN plan_basics ON plan_basics.model_plan_id = qIDs.model_plan_id;
