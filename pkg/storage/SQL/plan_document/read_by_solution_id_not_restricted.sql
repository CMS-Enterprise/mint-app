SELECT
    doc.id,
    doc.model_plan_id,
    doc.file_type,
    doc.bucket,
    doc.file_key,
    doc.virus_scanned,
    doc.virus_clean,
    doc.file_name,
    doc.file_size,
    doc.restricted,
    doc.document_type,
    doc.other_type,
    doc.optional_notes,
    doc.is_link,
    doc.url,
    doc.deleted_at,
    doc.created_by,
    doc.created_dts,
    doc.modified_by,
    doc.modified_dts
FROM plan_document AS doc
INNER JOIN plan_document_solution_link AS link ON link.document_id = doc.id
WHERE link.solution_id = :solution_id AND doc.restricted = FALSE
