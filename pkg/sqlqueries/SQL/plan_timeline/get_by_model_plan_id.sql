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
FROM plan_timeline
WHERE plan_timeline.model_plan_id = :model_plan_id;
