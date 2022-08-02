DELETE
FROM plan_milestones
WHERE id = :id
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
ready_for_review_by,
ready_for_review_dts,
status
