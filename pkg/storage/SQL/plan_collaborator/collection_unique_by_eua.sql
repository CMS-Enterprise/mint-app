SELECT DISTINCT ON (eua_user_id)
    id,
    model_plan_id,
    user_id,
    team_role,
    created_by,
    created_dts,
    modified_by,
    modified_dts
FROM plan_collaborator
ORDER BY eua_user_id ASC, created_dts DESC
