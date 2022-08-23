INSERT INTO plan_favorite(
    id,
    model_plan_id,
    user_id,
    created_by,
    created_dts,
    modified_by,
    modified_dts
)
VALUES (
    :id,
    :model_plan_id,
    :user_id,
    :created_by,
    :created_dts,
    :modified_by,
    :modified_dts
)
RETURNING
id,
model_plan_id,
user_id,
created_by,
created_dts,
modified_by,
modified_dts;
