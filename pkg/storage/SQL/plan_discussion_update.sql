UPDATE plan_discussion
SET
    model_plan_id = :model_plan_id,
    content = :content,
    status = :status,
    modified_by = :modified_by,
    modified_dts = CURRENT_TIMESTAMP
WHERE id = :id
RETURNING
id,
model_plan_id,
content,
status,
created_by,
created_dts,
modified_by,
modified_dts;
