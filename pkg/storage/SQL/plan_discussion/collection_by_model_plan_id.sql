SELECT
    id,
    model_plan_id,
    content,
    status,
    is_assessment,
    created_by,
    created_dts,
    modified_by,
    modified_dts
FROM plan_discussion
WHERE model_plan_id = :model_plan_id
