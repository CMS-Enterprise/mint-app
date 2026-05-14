SELECT
    id,
    model_plan_id,
    common_waiver_id,
    will_use_waiver,
    not_using_reason,
    created_by,
    created_dts,
    modified_by,
    modified_dts
FROM waiver
WHERE id = :id;
