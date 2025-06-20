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
FROM timeline
WHERE timeline.model_plan_id = :model_plan_id;
