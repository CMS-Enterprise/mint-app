SELECT
    id,
    model_plan_id,
    need_type,
    -- NULL AS need_name,
    -- NULL AS need_key,
    name_other,
    needed,
    created_by,
    created_dts,
    modified_by,
    modified_dts
FROM
    operational_need
WHERE model_plan_id = :model_plan_id AND name_other = :name_other;
