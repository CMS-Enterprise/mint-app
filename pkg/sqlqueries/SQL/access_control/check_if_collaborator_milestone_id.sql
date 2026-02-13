SELECT EXISTS(
    SELECT 1
    FROM plan_collaborator
    INNER JOIN mto_milestone ON mto_milestone.model_plan_id = plan_collaborator.model_plan_id
    WHERE
        mto_milestone.id = :milestone_id
        AND plan_collaborator.user_id = :user_id
) AS isCollaborator;
