SELECT EXISTS(
    SELECT 1
    FROM PLAN_COLLABORATOR
    INNER JOIN OPERATIONAL_SOLUTION AS solution ON :solution_id = solution.id
    INNER JOIN OPERATIONAL_NEED AS need ON solution.operational_need_id = need.id
    WHERE need.model_plan_id = PLAN_COLLABORATOR.model_plan_id
        AND PLAN_COLLABORATOR.eua_user_id = :eua_user_id
) AS isCollaborator
