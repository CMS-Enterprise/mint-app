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
WHERE id =  :id;
