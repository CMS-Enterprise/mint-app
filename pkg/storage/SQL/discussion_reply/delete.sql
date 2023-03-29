WITH user_context AS ( -- noqa
    SELECT set_config('app.current_user', :user_id, FALSE)
)

DELETE FROM discussion_reply
WHERE id = :id
RETURNING id,
discussion_id,
content,
resolution,
is_assessment,
created_by,
created_dts,
modified_by,
modified_dts;
