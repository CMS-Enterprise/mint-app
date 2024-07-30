SELECT
    id,
    change_id,
    status,
    attempts,
    note,
    created_by,
    created_dts,
    modified_by,
    modified_dts
FROM public.translated_audit_queue
WHERE status = 'NEW'
ORDER BY CHANGE_ID ASC;
