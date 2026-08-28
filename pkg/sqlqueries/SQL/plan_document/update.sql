WITH updated_plan_document AS (
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
        is_link = :is_link,
        url = :url,
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
        is_link,
        url,
        deleted_at,
        created_by,
        created_dts,
        modified_by,
        modified_dts
)

SELECT
    updated_plan_document.id,
    updated_plan_document.model_plan_id,
    updated_plan_document.file_type,
    updated_plan_document.bucket,
    updated_plan_document.file_key,
    updated_plan_document.virus_scanned,
    updated_plan_document.virus_clean,
    updated_plan_document.file_name,
    updated_plan_document.file_size,
    updated_plan_document.restricted,
    updated_plan_document.document_type,
    link.plan_task_id,
    updated_plan_document.other_type,
    updated_plan_document.optional_notes,
    updated_plan_document.is_link,
    updated_plan_document.url,
    updated_plan_document.deleted_at,
    updated_plan_document.created_by,
    updated_plan_document.created_dts,
    updated_plan_document.modified_by,
    updated_plan_document.modified_dts
FROM updated_plan_document
LEFT JOIN plan_task_document_link AS link ON link.plan_document_id = updated_plan_document.id;
