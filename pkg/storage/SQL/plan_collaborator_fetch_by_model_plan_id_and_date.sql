SELECT
    id,
    model_plan_id,
    eua_user_id,
    full_name,
    team_role,
    email,
    created_by,
    created_dts,
    modified_by,
    modified_dts
FROM plan_collaborator
WHERE model_plan_id = :model_plan_id;
  AND created_dts >= :start_date::TIMESTAMP AND created_dts < :end_date::TIMESTAMP
