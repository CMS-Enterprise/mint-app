SELECT EXISTS(
    SELECT 1
    FROM PLAN_COLLABORATOR AS collab
    INNER JOIN OPERATIONAL_NEED AS need ON need.model_plan_id = collab.model_plan_id
    WHERE need.id = :need_id
        AND PLAN_COLLABORATOR.eua_user_id = :eua_user_id
) AS isCollaborator
