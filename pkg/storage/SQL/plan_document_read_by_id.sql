SELECT
    id,
    model_plan_id,
    file_type,
    bucket,
    file_key,
    virus_scanned,
    virus_clean,
    file_name,
    file_size,
    document_type,
    other_type,
    optional_notes,
    deleted_at,
    created_by,
    created_dts,
    modified_by,
    modified_dts
FROM plan_document
WHERE id = :id
