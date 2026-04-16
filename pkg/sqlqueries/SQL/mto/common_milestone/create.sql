INSERT INTO mto_common_milestone (
    id,
    name,
    description,
    category_name,
    sub_category_name,
    facilitated_by_role,
    facilitated_by_other,
    trigger_col,
    trigger_vals,
    created_by
)
VALUES (
    :id,
    :name,
    :description,
    :category_name,
    :sub_category_name,
    :facilitated_by_role,
    :facilitated_by_other,
    :trigger_col,
    :trigger_vals,
    :created_by
)
RETURNING
    id,
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
