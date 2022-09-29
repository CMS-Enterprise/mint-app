INSERT INTO operational_need (
    id,
    model_plan_id,
    need_type,
    need_other,
    needed,
    created_by
)
SELECT
    :id AS id,
    :model_plan_id AS model_plan_id,
    possible_operational_need.id AS need_type,
    :need_other AS need_other,
    :needed AS needed,
    :created_by AS created_by
FROM possible_operational_need
WHERE possible_operational_need.short_name = :need_type_key
RETURNING
    id,
    model_plan_id,
    need_type,
    need_other,
    needed,
    created_by,
    created_dts,
    modified_by,
    modified_dts;
