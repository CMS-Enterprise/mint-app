SELECT
    id,
    model_plan_id,
    common_waiver_id,
    created_by,
    created_dts,
    modified_by,
    modified_dts
FROM suggested_waiver
WHERE id = :id;
