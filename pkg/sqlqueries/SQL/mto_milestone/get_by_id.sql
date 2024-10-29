SELECT
    id,
    model_plan_id,
    mto_common_milestone_id,
    name,
    facilitated_by,
    need_by,
    status,
    risk_indicator,
    is_draft,
    created_by,
    created_dts,
    modified_by,
    modified_dts
FROM mto_milestone
WHERE  id = :id;
