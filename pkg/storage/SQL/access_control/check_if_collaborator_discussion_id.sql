SELECT EXISTS(
    SELECT 1
    FROM PLAN_COLLABORATOR
    INNER JOIN PLAN_DISCUSSION ON PLAN_COLLABORATOR.model_plan_id = PLAN_DISCUSSION.model_plan_id
    WHERE
        PLAN_DISCUSSION.id = :discussion_id
        AND PLAN_COLLABORATOR.user_id = :user_id
) AS isCollaborator
