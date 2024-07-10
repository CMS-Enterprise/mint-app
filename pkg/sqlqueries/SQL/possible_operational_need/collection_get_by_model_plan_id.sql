SELECT
    id,
    need_name,
    need_key,
    section,
    created_by,
    created_dts,
    modified_by,
    modified_dts
FROM
    possible_operational_need
WHERE id NOT IN ( SELECT need_type FROM operational_need WHERE model_plan_id = :model_plan_id AND need_type IS NOT NULL)
