UPDATE plan_basics
SET
    model_plan_id = :model_plan_id,
    model_type = :model_type,
    problem = :problem,
    goal = :goal,
    test_interventions = :test_interventions,
    note = :note,
    modified_by = :modified_by,
    modified_dts = CURRENT_TIMESTAMP,
    ready_for_review_by = :ready_for_review_by,
    ready_for_review_dts = :ready_for_review_dts,
    status = :status
WHERE plan_basics.id = :id
RETURNING
id,
model_plan_id,
model_type,
problem,
goal,
test_interventions,
note,
created_by,
created_dts,
modified_by,
modified_dts,
ready_for_review_by,
ready_for_review_dts,
status;
