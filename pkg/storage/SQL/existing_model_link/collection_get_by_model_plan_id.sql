SELECT
    id,
    model_plan_id,
    existing_model_id,
    current_model_plan_id,
    created_by,
    created_dts,
    modified_by,
    modified_dts
FROM existing_model_link
WHERE model_plan_id = :model_plan_id;
