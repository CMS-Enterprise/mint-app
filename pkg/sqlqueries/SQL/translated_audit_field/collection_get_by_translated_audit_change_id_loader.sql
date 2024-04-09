WITH QUERIED_IDS AS (
    /*Translate the input to a table */
    SELECT translated_audit_id
    FROM
        JSON_TO_RECORDSET(:paramTableJSON)
        AS x("translated_audit_id" UUID) --noqa
)

SELECT 
    TAF.id,
    TAF.translated_audit_id,
    TAF.change_type,
    TAF.field_name,
    TAF.field_name_translated,
    TAF.old,
    TAF.old_translated,
    TAF.new,
    TAF.new_translated,
    TAF.meta_data,
    TAF.created_by,
    TAF.created_dts,
    TAF.modified_by,
    TAF.modified_dts
FROM translated_audit_field AS TAF
INNER JOIN QUERIED_IDS AS qIDs  ON TAF.translated_audit_id = qIDs.translated_audit_id;
