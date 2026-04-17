UPDATE mto_common_milestone
SET
    name = CAST(:name AS ZERO_STRING),
    description = CAST(:description AS ZERO_STRING),
    category_name = CAST(:category_name AS ZERO_STRING),
    sub_category_name = CAST(:sub_category_name AS ZERO_STRING),
    facilitated_by_role = CAST(:facilitated_by_role AS MTO_FACILITATOR[]),
    facilitated_by_other = CAST(:facilitated_by_other AS ZERO_STRING),
    modified_by = :modified_by,
    modified_dts = CURRENT_TIMESTAMP
WHERE id = :id
RETURNING
    id,
    created_by,
    created_dts,
    modified_by,
    modified_dts,
    name,
    description,
    category_name,
    sub_category_name,
    facilitated_by_role,
    facilitated_by_other,
    section,
    is_archived,
    CAST(NULL AS UUID) AS model_plan_id,
    FALSE AS is_added,
    CAST(NULL AS UUID) AS mto_suggested_milestone_id;
