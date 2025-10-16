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
    model_plan.modified_dts
FROM model_plan
WHERE 
    model_plan.created_dts >= CURRENT_TIMESTAMP - INTERVAL '6 months'
ORDER BY model_plan.created_dts DESC
