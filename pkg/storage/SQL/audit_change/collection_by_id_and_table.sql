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
WHERE audit.table_config.name = :table_name AND audit.change.primary_key = :primary_key;
