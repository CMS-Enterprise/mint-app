WITH QUERIED_IDS AS (
    /*Translate the input to a table */
    SELECT UNNEST(CAST(:model_plan_ids AS UUID[]))  AS model_plan_id
)

SELECT
    plan_timeline.id,
    plan_timeline.model_plan_id,
    plan_timeline.complete_icip,
    plan_timeline.clearance_starts,
    plan_timeline.clearance_ends,
    plan_timeline.announced,
    plan_timeline.applications_starts,
    plan_timeline.applications_ends,
    plan_timeline.performance_period_starts,
    plan_timeline.performance_period_ends,
    plan_timeline.wrap_up_ends,
    plan_timeline.high_level_note,
    plan_timeline.created_by,
    plan_timeline.created_dts,
    plan_timeline.modified_by,
    plan_timeline.modified_dts,
    plan_timeline.ready_for_review_by,
    plan_timeline.ready_for_review_dts,
    plan_timeline.ready_for_clearance_by,
    plan_timeline.ready_for_clearance_dts,
    plan_timeline.status
FROM QUERIED_IDS AS qIDs
INNER JOIN plan_timeline ON plan_timeline.model_plan_id = qIDs.model_plan_id;
