SELECT
    id,
    model_plan_id,
    complete_icip,
    clearance_starts,
    clearance_ends,
    announced,
    applications_starts,
    applications_ends,
    performance_period_starts,
    performance_period_ends,
    wrap_up_ends,
    high_level_note,
    created_by,
    created_dts,
    modified_by,
    modified_dts,
    ready_for_review_by,
    ready_for_review_dts,
    ready_for_clearance_by,
    ready_for_clearance_dts,
    status
FROM timeline
WHERE id = :id
