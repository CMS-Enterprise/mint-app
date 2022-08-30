SELECT
    id,
    model_plan_id,
    user_id,
    created_by,
    created_dts,
    modified_by,
    modified_dts
FROM plan_favorite WHERE user_id = :user_id AND model_plan_id = :model_plan_id;
