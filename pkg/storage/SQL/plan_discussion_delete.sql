DELETE FROM plan_discussion
WHERE id = :id
RETURNING id,
model_plan_id,
content,
status,
created_by,
created_dts,
modified_by,
modified_dts;
