INSERT INTO suggested_waiver (
    id,
    model_plan_id,
    common_waiver_id,
    created_by
)
VALUES (
    :id,
    :model_plan_id,
    :common_waiver_id,
    :created_by
)
RETURNING
    id,
    model_plan_id,
    common_waiver_id,
    created_by,
    created_dts,
    modified_by,
    modified_dts;
