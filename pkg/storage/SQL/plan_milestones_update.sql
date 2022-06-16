UPDATE plan_milestones
SET
    complete_icip = :complete_icip,
    clearance_starts = :clearance_starts,
    clearance_ends = :clearance_ends,
    announced = :announced,
    applications_starts = :applications_starts,
    applications_ends = :applications_ends,
    performance_period_starts = :performance_period_starts,
    performance_period_ends = :performance_period_ends,
    wrap_up_ends = :wrap_up_ends,
    high_level_note = :high_level_note,
    phased_in = :phased_in,
    phased_in_note = :phased_in_note,
    modified_by = :modified_by,
    modified_dts = CURRENT_TIMESTAMP,
    status = :status

WHERE plan_milestones.id = :id
RETURNING
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
status;
