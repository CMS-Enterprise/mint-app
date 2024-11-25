DELETE
FROM plan_collaborator
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
