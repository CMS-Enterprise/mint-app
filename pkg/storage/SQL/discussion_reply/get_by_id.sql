SELECT
    id,
    discussion_id,
    content,
    user_role,
    user_role_description,
    is_assessment,
    created_by,
    created_dts,
    modified_by,
    modified_dts
FROM discussion_reply
WHERE id = :id
ORDER BY created_dts ASC
