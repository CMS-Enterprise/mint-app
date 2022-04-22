UPDATE plan_milestones
SET
  enter_cms_clearance = :enter_cms_clearance,
  enter_hhs_omb_clearance = :enter_hhs_omb_clearance,
  cleared = :cleared,
  announced = :announced,
  applications_due = :applications_due,
  participants_announced = :participants_announced,
  performance_period_starts = :performance_period_starts,
  performance_period_ends = :performance_period_ends,
  modified_by = :modified_by,
  modified_dts = CURRENT_TIMESTAMP

WHERE plan_milestones.id = :id
    RETURNING *;
