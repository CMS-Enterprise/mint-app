SELECT
    id,
    model_name,
    status,
    archived,
    created_by,
    created_dts,
    modified_by,
    modified_dts
FROM model_plan
INNER JOIN plan_favorite ON model_plan.id = plan_favorite.id
