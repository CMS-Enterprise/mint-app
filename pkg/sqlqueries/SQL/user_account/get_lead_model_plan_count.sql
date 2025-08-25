SELECT COUNT(*)
FROM plan_collaborator
WHERE
    user_id = :user_id
    AND 'MODEL_LEAD' = ANY(team_roles);
