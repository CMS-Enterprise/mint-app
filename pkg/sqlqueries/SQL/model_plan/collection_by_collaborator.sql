SELECT
    model_plan.id,
    model_plan.model_name,
    model_plan.abbreviation,
    model_plan.status,
    model_plan.previous_suggested_phase,
    model_plan.archived,
    model_plan.created_by,
    model_plan.created_dts,
    model_plan.modified_by,
    model_plan.modified_dts,
    model_plan.mto_ready_for_review_by,
    model_plan.mto_ready_for_review_dts
FROM model_plan
INNER JOIN plan_collaborator ON model_plan.id = plan_collaborator.model_plan_id

WHERE plan_collaborator.user_id = :user_id AND model_plan.archived = :archived
