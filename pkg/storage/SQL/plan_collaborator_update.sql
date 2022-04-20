UPDATE plan_collaborator
SET
    model_plan_id = :model_plan_id,
    eua_user_id = :eua_user_id,
    full_name = :full_name,
    cms_center = :cms_center,
    team_role = :team_role,
    modified_by = :modified_by,
    modified_dts = CURRENT_TIMESTAMP
WHERE plan_collaborator.id = :id
    RETURNING
        id,
        model_plan_id,
        eua_user_id,
        full_name,
        cms_center,
        team_role,
        created_by,
        created_dts,
        modified_by,
        modified_dts
        ;
