SELECT
    id,
    model_plan_id,
    need_type,
    NULL AS name,
    NULL AS key,
    name_other,
    needed,
    created_by,
    created_dts,
    modified_by,
    modified_dts
FROM
    operational_need
WHERE model_plan_id = :model_plan_id AND name_other = :name_other;
