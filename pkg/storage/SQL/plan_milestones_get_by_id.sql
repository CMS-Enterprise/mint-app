SELECT
    id,
    enter_cms_clearance,
    enter_hhs_omb_clearance,
    cleared,
    announced,
    applications_due,
    participants_announced,
    performance_period_starts,
    performance_period_ends,
    created_by,
    created_dts,
    modified_by,
    modified_dts
FROM plan_milestones
WHERE id = :id
