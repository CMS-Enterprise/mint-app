SELECT COUNT(*)
FROM plan_collaborator pc
JOIN model_plan mp ON pc.model_plan_id = mp.id
WHERE 
    pc.user_id = :user_id
    AND 'MODEL_LEAD' = ANY(pc.team_roles)
    AND mp.archived = FALSE;
