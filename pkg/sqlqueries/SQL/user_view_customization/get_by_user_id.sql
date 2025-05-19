SELECT
    id,
    user_id,
    view_customization,
    solutions,
    created_by,
    created_dts,
    modified_by,
    modified_dts
FROM user_view_customization
WHERE user_id = :user_id
