SELECT 
    id,
    translated_audit_id,
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
FROM translated_audit_field
WHERE translated_audit_id = :translated_audit_id
