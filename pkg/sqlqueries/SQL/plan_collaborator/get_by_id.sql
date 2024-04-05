SELECT
    id,
    model_plan_id,
    user_id,
    team_roles,
    created_by,
    created_dts,
    modified_by,
    modified_dts
FROM plan_collaborator
WHERE id = :id;
