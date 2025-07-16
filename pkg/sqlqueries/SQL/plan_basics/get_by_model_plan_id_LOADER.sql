WITH QUERIED_IDS AS (
    /*Translate the input to a table */
    SELECT UNNEST(CAST(:model_plan_ids AS UUID[]))  AS model_plan_id
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
