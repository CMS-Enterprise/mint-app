SELECT
    model_plan.id,
    model_plan.model_name,
    model_plan.abbreviation,
    model_plan.status,
    model_plan.archived,
    model_plan.created_by,
    model_plan.created_dts,
    model_plan.modified_by,
    model_plan.modified_dts
FROM model_plan
INNER JOIN plan_collaborator ON plan_collaborator.model_plan_id = model_plan.id

WHERE plan_collaborator.user_id = :user_id AND model_plan.archived = :archived
