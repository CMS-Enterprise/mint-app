DELETE FROM suggested_waiver
WHERE model_plan_id = :model_plan_id
RETURNING
    id,
    model_plan_id,
    common_waiver_id,
    created_by,
    created_dts,
    modified_by,
    modified_dts;
