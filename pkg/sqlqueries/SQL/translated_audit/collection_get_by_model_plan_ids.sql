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
    restricted,
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
        ( restricted = FALSE AND :restricted_access = FALSE ) --user does not have access to restricted audits, only show non-restricted
        OR :restricted_access = TRUE --show all audits if the user has access to restricted audits
    )
ORDER BY change_id DESC
LIMIT
    :limit_count
    OFFSET :offset_count;
