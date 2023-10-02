INSERT INTO plan_discussion(
    id,
    model_plan_id,
    content,
    user_role,
    user_role_description,
    is_assessment,
    created_by,
    modified_by
)
VALUES (
    :id,
    :model_plan_id,
    :content,
    :user_role,
    :user_role_description,
    :is_assessment,
    :created_by,
    :modified_by
)
RETURNING id,
model_plan_id,
content,
user_role,
user_role_description,
is_assessment,
created_by,
created_dts,
modified_by,
modified_dts;
