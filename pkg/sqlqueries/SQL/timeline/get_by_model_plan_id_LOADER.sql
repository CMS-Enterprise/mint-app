WITH QUERIED_IDS AS (
    /*Translate the input to a table */
    SELECT UNNEST(CAST(:model_plan_ids AS UUID[]))  AS model_plan_id
)

SELECT
    timeline.id,
    timeline.model_plan_id,
    timeline.complete_icip,
    timeline.clearance_starts,
    timeline.clearance_ends,
    timeline.announced,
    timeline.applications_starts,
    timeline.applications_ends,
    timeline.performance_period_starts,
    timeline.performance_period_ends,
    timeline.wrap_up_ends,
    timeline.high_level_note,
    timeline.created_by,
    timeline.created_dts,
    timeline.modified_by,
    timeline.modified_dts,
    timeline.ready_for_review_by,
    timeline.ready_for_review_dts,
    timeline.ready_for_clearance_by,
    timeline.ready_for_clearance_dts,
    timeline.status
FROM QUERIED_IDS AS qIDs
INNER JOIN timeline ON timeline.model_plan_id = qIDs.model_plan_id;
