SELECT
    audit.change.id,
    audit.change.table_id,
    audit.change.primary_key,
    audit.change.foreign_key,
    audit.change.action,

    -- Converts from JSONB to TEXT as Logstash can't handle JSONB
    CAST(audit.change.fields AS TEXT) AS fields_data,

    audit.change.modified_dts,

    -- Extracts the user_account JSONB into a TEXT field
    CAST(ROW_TO_JSON(user_account.*) AS TEXT) AS modified_by,

    -- Creates a GUID from the table_id and primary_key
    CONCAT(audit.change.table_id::TEXT, '_', audit.change.primary_key::TEXT) AS guid

FROM audit.change
LEFT JOIN user_account ON audit.change.modified_by = user_account.id
WHERE audit.change.id > :sql_last_value
