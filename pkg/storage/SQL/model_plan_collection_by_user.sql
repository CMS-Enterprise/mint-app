SELECT
    model_plan.id,
    model_plan.model_name,
    model_plan.status,
    model_plan.archived,
    model_plan.created_by,
    model_plan.created_dts,
    model_plan.modified_by,
    model_plan.modified_dts,
    plan_favorite.id IS NOT NULL AS is_favorite
FROM model_plan
INNER JOIN plan_collaborator ON plan_collaborator.model_plan_id = model_plan.id
LEFT JOIN plan_favorite ON model_plan.id = plan_favorite.model_plan_id AND plan_favorite.user_id = :euaID

WHERE plan_collaborator.eua_user_id = :euaID AND model_plan.archived = :archived
