UPDATE discussion_reply
SET
    discussion_id = :discussion_id,
    content = :content,
    user_role = :user_role,
    user_role_description = :user_role_description,
    modified_by = :modified_by,
    modified_dts = CURRENT_TIMESTAMP
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
