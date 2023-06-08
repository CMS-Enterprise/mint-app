SELECT
    id,
    model_name,
    model_abbreviation,
    archived,
    status,
    created_by,
    created_dts,
    modified_by,
    modified_dts
FROM model_plan
WHERE id = :id
