DELETE
FROM plan_collaborator
WHERE plan_collaborator.id = :id
RETURNING
id,
model_plan_id,
eua_user_id,
full_name,
team_role,
email,
created_by,
created_dts,
modified_by,
modified_dts;
