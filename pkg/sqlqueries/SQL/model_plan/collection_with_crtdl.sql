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
WHERE EXISTS (SELECT 1 FROM plan_tdl WHERE model_plan_id = model_plan.id) OR EXISTS (SELECT 1 FROM plan_cr WHERE model_plan_id = model_plan.id) --noqa
    AND model_plan.archived = FALSE
