SELECT
    id,
    model_plan_id,
    solution_id,
    document_id,
    created_by,
    created_dts,
    modified_by,
    modified_dts
FROM plan_document_solution_link
WHERE model_plan_id = :model_plan_id
