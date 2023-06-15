DELETE FROM plan_discussion
WHERE id = :id
RETURNING id,
model_plan_id,
content,
user_role,
status,
is_assessment,
created_by,
created_dts,
modified_by,
modified_dts;
