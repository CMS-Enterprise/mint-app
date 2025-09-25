SELECT 
    id,
    model_plan_id,
    template_id,
    applied_date,
    created_by,
    created_dts,
    modified_by,
    modified_dts
FROM model_plan_mto_template_link
WHERE model_plan_id = ANY(:model_plan_ids)
ORDER BY applied_date DESC;
