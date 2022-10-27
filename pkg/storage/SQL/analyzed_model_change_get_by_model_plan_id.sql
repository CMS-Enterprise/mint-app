SELECT
    id,
    model_plan_id,
    date,
    changes,
    created_by,
    created_dts,
    modified_by,
    modified_dts
FROM analyzed_model_change
WHERE id = :id;
