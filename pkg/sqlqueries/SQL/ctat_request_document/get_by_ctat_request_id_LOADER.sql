SELECT
    ctat_request_document.id,
    ctat_request_document.ctat_request_id,
    ctat_request_document.url,
    ctat_request_document.file_type,
    ctat_request_document.bucket,
    ctat_request_document.file_key,
    ctat_request_document.virus_scanned,
    ctat_request_document.virus_clean,
    ctat_request_document.restricted,
    ctat_request_document.file_name,
    ctat_request_document.file_size,
    ctat_request_document.created_by,
    ctat_request_document.created_dts,
    ctat_request_document.modified_by,
    ctat_request_document.modified_dts
FROM ctat_request_document
WHERE ctat_request_document.ctat_request_id = ANY(:ctat_request_ids)
ORDER BY ctat_request_document.created_dts ASC, ctat_request_document.id ASC;
