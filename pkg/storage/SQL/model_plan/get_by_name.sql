SELECT
    id,
    model_name,
    archived,
    status,
    created_by,
    created_dts,
    modified_by,
    modified_dts
FROM model_plan
WHERE model_name = :model_name
