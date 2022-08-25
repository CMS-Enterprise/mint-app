SELECT
    model_plan.id,
    model_plan.model_name,
    model_plan.archived,
    model_plan.status,
    model_plan.created_by,
    model_plan.created_dts,
    model_plan.modified_by,
    model_plan.modified_dts,
    plan_favorite.id IS NOT NULL AS is_favorite
FROM model_plan LEFT JOIN plan_favorite ON model_plan.id = plan_favorite.model_plan_id AND plan_favorite.user_id = :user_id
WHERE model_plan.id = :id
