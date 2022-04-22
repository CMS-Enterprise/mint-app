UPDATE plan_basics
SET
  model_plan_id = :model_plan_id,
  model_type = :model_type,
  problem = :problem,
  goal = :goal,
  test_inventions = :test_inventions,
  note = :note,
  modified_by = :modified_by,
  modified_dts = CURRENT_TIMESTAMP,
  status = :status
WHERE plan_basics.id = :id
    RETURNING *;
