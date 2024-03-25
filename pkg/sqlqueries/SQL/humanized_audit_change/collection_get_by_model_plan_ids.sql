SELECT 
    id,
    model_plan_id,
    actor_id,
    change_id,
    date,
    table_id,
    table_name,
    action,
    field_name,
    field_name_translated,
    old,
    old_translated,
    new,
    new_translated,
    meta_data,
    model_name,
    created_by,
    created_dts,
    modified_by,
    modified_dts
FROM humanized_audit_change
WHERE model_plan_id = :model_plan_id;
