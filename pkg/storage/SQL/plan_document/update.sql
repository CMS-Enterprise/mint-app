UPDATE plan_document
SET
    file_type = :file_type,
    bucket = :bucket,
    file_key = :file_key,
    virus_scanned = :virus_scanned,
    virus_clean = :virus_clean,
    file_name = :file_name,
    file_size = :file_size,
    restricted = :restricted,
    document_type = :document_type,
    other_type = :other_type,
    optional_notes = :optional_notes,
    deleted_at = :deleted_at,
    modified_by = :modified_by,
    modified_dts = CURRENT_TIMESTAMP

WHERE plan_document.id = :id
RETURNING
id,
model_plan_id,
file_type,
bucket,
file_key,
virus_scanned,
virus_clean,
file_name,
file_size,
restricted,
document_type,
other_type,
optional_notes,
deleted_at,
created_by,
created_dts,
modified_by,
modified_dts;
