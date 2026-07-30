UPDATE plan_discussion
SET
    model_plan_id = :model_plan_id,
    topic = :topic,
    content = :content,
    user_role = :user_role,
    user_role_description = :user_role_description,
    modified_by = :modified_by,
    modified_dts = CURRENT_TIMESTAMP
WHERE id = :id
RETURNING
    id,
    model_plan_id,
    topic,
    content,
    user_role,
    user_role_description,
    is_assessment,
    created_by,
    created_dts,
    modified_by,
    modified_dts;
