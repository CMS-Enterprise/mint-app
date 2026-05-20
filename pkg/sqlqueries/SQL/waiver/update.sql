UPDATE waiver
SET
    will_use_waiver = :will_use_waiver,
    not_using_reason = :not_using_reason,
    modified_by = :modified_by,
    modified_dts = CURRENT_TIMESTAMP
WHERE id = :id
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
