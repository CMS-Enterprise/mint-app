UPDATE mto_milestone 
SET
    assigned_to = NULL,
    modified_by = :modified_by,
    modified_dts = CURRENT_TIMESTAMP
WHERE
    assigned_to = (
        SELECT user_id 
        FROM plan_collaborator 
        WHERE plan_collaborator.id = :collaborator_id
    )
    AND model_plan_id = (
        SELECT model_plan_id 
        FROM plan_collaborator 
        WHERE plan_collaborator.id = :collaborator_id
    )
RETURNING
    id,
    model_plan_id,
    mto_common_milestone_key,
    mto_category_id,
    name,
    facilitated_by,
    facilitated_by_other,
    assigned_to,
    need_by,
    status,
    risk_indicator,
    is_draft,
    created_by,
    created_dts,
    modified_by,
    modified_dts
