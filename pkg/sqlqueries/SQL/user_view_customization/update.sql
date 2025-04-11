UPDATE user_view_customization
SET
    view_customization = :view_customization,
    solutions = :solutions,
    modified_by = :modified_by,
    modified_dts = NOW()
WHERE user_id = :user_id
RETURNING
    id,
    user_id,
    view_customization,
    solutions,
    created_by,
    created_dts,
    modified_by,
    modified_dts;
