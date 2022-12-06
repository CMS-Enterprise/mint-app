INSERT INTO plan_favorite(
    id,
    model_plan_id,
    user_id,
    created_by,
    modified_by
)
VALUES (
    :id,
    :model_plan_id,
    :user_id,
    :created_by,
    :modified_by
)
RETURNING
id,
model_plan_id,
user_id,
created_by,
created_dts,
modified_by,
modified_dts;
