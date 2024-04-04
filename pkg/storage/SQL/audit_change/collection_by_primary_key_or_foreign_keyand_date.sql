SELECT
    audit.change.id,
    audit.change.table_id,
    audit.change.primary_key,
    audit.change.foreign_key,
    audit.table_config.name AS table_name,
    audit.change.action,
    audit.change.fields,
    audit.change.modified_by,
    audit.change.modified_dts
FROM audit.change
INNER JOIN audit.table_config ON audit.table_config.id = audit.change.table_id
WHERE
    (audit.change.foreign_key = :foreign_key OR audit.change.primary_key = :primary_key)
    AND audit.change.modified_dts >= :start_date AND audit.change.modified_dts < :end_date
