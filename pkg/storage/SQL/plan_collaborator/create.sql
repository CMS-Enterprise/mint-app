INSERT INTO plan_collaborator (
    id,
    model_plan_id,
    user_id,
    team_roles,
    created_by,
    modified_by
)
VALUES (
    :id,
    :model_plan_id,
    :user_id,
    :team_roles,
    :created_by,
    :modified_by
)
RETURNING
id,
model_plan_id,
user_id,
team_roles,
created_by,
created_dts,
modified_by,
modified_dts;
