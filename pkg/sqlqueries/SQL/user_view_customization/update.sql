UPDATE user_view_customization
SET
    view_customization = :view_customization,
    solutions = :solutions,
    component_groups = :component_groups,
    modified_by = :modified_by,
    modified_dts = NOW()
WHERE user_id = :user_id
RETURNING
    id,
    user_id,
    view_customization,
    solutions,
    component_groups,
    created_by,
    created_dts,
    modified_by,
    modified_dts;
