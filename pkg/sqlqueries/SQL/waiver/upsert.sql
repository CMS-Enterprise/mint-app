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
ON CONFLICT (model_plan_id, common_waiver_id) DO UPDATE SET
will_use_waiver = EXCLUDED.will_use_waiver,
not_using_reason = EXCLUDED.not_using_reason,
modified_by = :modified_by,
modified_dts = CURRENT_TIMESTAMP
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
