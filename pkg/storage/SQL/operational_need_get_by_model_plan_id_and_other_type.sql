SELECT
    id,
    model_plan_id,
    need_type,
    'Other' AS need_type_full_name,
    'OTHER' AS need_type_short_name,
    need_other,
    needed,
    created_by,
    created_dts,
    modified_by,
    modified_dts
FROM
    operational_need
WHERE model_plan_id = :model_plan_id AND need_other = :need_other;
