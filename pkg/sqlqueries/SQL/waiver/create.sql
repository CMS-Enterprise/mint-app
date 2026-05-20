INSERT INTO waiver (
    id,
    model_plan_id,
    common_waiver_id,
    will_use_waiver,
    not_using_reason,
    created_by
)
VALUES (
    :id,
    :model_plan_id,
    :common_waiver_id,
    :will_use_waiver,
    :not_using_reason,
    :created_by
)
RETURNING
    id,
    model_plan_id,
    common_waiver_id,
    will_use_waiver,
    not_using_reason,
    created_by,
    created_dts,
    modified_by,
    modified_dts;
