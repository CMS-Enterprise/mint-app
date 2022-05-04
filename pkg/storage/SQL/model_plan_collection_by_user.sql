SELECT
    model_plan.id,
    model_plan.model_name,
    model_plan.model_category,
    model_plan.cms_centers,
    model_plan.cms_other,
    model_plan.status,
    model_plan.cmmi_groups,
    model_plan.archived,
    model_plan.created_by,
    model_plan.created_dts,
    model_plan.modified_by,
    model_plan.modified_dts
FROM model_plan
INNER JOIN plan_collaborator ON plan_collaborator.model_plan_id = model_plan.id

WHERE plan_collaborator.eua_user_id = :euaID AND model_plan.archived = :archived
