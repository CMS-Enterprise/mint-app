SELECT
    plan_document.id,
    plan_document.model_plan_id,
    plan_document.file_type,
    plan_document.bucket,
    plan_document.file_key,
    plan_document.virus_scanned,
    plan_document.virus_clean,
    plan_document.file_name,
    plan_document.file_size,
    plan_document.restricted,
    plan_document.document_type,
    link.plan_task_id,
    plan_document.other_type,
    plan_document.optional_notes,
    plan_document.is_link,
    plan_document.url,
    plan_document.deleted_at,
    plan_document.created_by,
    plan_document.created_dts,
    plan_document.modified_by,
    plan_document.modified_dts
FROM plan_document
LEFT JOIN plan_task_document_link AS link ON link.plan_document_id = plan_document.id
WHERE plan_document.model_plan_id = :model_plan_id
