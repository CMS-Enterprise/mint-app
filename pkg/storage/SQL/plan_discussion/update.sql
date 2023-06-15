UPDATE plan_discussion
SET
    model_plan_id = :model_plan_id,
    content = :content,
    user_role = :user_role,
    status = :status,
    modified_by = :modified_by,
    modified_dts = CURRENT_TIMESTAMP
WHERE id = :id
RETURNING
id,
model_plan_id,
content,
user_role,
status,
is_assessment,
created_by,
created_dts,
modified_by,
modified_dts;
