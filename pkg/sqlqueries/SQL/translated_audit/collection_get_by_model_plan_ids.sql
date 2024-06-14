SELECT 
    id,
    model_plan_id,
    actor_id,
    actor_name,
    change_id,
    date,
    table_id,
    table_name,
    primary_key,
    action,
    is_confidential,
    meta_data_type,
    meta_data,
    model_name,
    created_by,
    created_dts,
    modified_by,
    modified_dts
FROM translated_audit
WHERE
    model_plan_id = :model_plan_id
    AND (
        ( is_confidential = FALSE AND :privileged_access = FALSE ) --user does not have privileged access, only show non-confidential
        OR :privileged_access = TRUE --show all audits if the user has privileged access
    )
ORDER BY change_id DESC;
