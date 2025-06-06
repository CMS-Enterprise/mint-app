WITH table_names_input AS (
    SELECT unnest(cast(:table_names AS TABLE_NAME[])) AS name
),

should_filter AS ( --Are there any table names to filter by?
    SELECT exists(SELECT 1 FROM table_names_input) AS filter
)

SELECT 
    tAudit.id,
    tAudit.model_plan_id,
    tAudit.actor_id,
    actor.common_name AS actor_name,
    tAudit.change_id,
    tAudit.date,
    tAudit.table_id,
    table_config.name AS table_name,
    tAudit.primary_key,
    tAudit.action,
    tAudit.restricted,
    tAudit.meta_data_type,
    tAudit.meta_data,
    tAudit.created_by,
    tAudit.created_dts,
    tAudit.modified_by,
    tAudit.modified_dts
FROM translated_audit AS tAudit
LEFT JOIN user_account AS actor ON tAudit.actor_id = actor.id
LEFT JOIN audit.table_config ON tAudit.table_id = table_config.id
WHERE
    tAudit.model_plan_id = :model_plan_id
    AND (
        ( tAudit.restricted = FALSE AND :restricted_access = FALSE ) --user does not have access to restricted audits, only show non-restricted
        OR :restricted_access = TRUE --show all audits if the user has access to restricted audits
    )
    AND (
        NOT (SELECT filter FROM should_filter)
        OR table_config.name IN (SELECT name FROM table_names_input)
    )
ORDER BY tAudit.change_id DESC
LIMIT
    :limit_count
    OFFSET :offset_count;
