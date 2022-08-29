SELECT EXISTS(
        SELECT 1
        FROM plan_collaborator
        WHERE model_plan_id = :model_plan_id
            AND eua_user_id = :eua_user_id
    ) AS isCollaborator
