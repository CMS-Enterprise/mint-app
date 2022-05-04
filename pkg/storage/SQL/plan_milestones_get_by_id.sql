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
    phased_in,
    phased_in_note,
    created_by,
    created_dts,
    modified_by,
    modified_dts,
    status
FROM plan_milestones
WHERE id = :id
