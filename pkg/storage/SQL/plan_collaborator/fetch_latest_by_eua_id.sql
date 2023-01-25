SELECT
    id,
    model_plan_id,
    user_id,
    team_role,
    created_by,
    created_dts,
    modified_by,
    modified_dts
FROM plan_collaborator
WHERE user_id = :user_id --TODO, this is expecting an EUAID, we might need to use a join
ORDER BY created_dts DESC
LIMIT 1;
