UPDATE plan_collaborator
SET
    model_plan_id = :model_plan_id,
    user_id = :user_id,
    team_roles = :team_roles,
    modified_by = :modified_by,
    modified_dts = CURRENT_TIMESTAMP
WHERE plan_collaborator.id = :id
RETURNING
id,
model_plan_id,
user_id,
team_roles,
created_by,
created_dts,
modified_by,
modified_dts;
