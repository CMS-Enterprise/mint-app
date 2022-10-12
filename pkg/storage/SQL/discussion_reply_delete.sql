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
