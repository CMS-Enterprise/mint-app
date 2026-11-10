SELECT
    id,
    model_plan_id,
    key_characteristics
FROM plan_general_characteristics
WHERE model_plan_id = :model_plan_id;
