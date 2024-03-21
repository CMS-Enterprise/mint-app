SELECT 
    id,
    model_plan_id,
    actor_id,
    change_id,
    date,
    time_start,
    time_end,
    changes,
    model_name,
    created_by,
    created_dts,
    modified_by,
    modified_dts
FROM humanized_audit_changes
WHERE model_plan_id = :model_plan_id;
