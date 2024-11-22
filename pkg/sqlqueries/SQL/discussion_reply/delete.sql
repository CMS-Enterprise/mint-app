DELETE FROM discussion_reply
WHERE id = :id
RETURNING
    id,
    discussion_id,
    content,
    user_role,
    user_role_description,
    is_assessment,
    created_by,
    created_dts,
    modified_by,
    modified_dts;
