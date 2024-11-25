UPDATE translated_audit_queue
SET
    status = 'QUEUED',
    modified_by = '00000001-0001-0001-0001-000000000001',
    modified_dts = CURRENT_TIMESTAMP
WHERE status = 'NEW'
RETURNING
    id,
    change_id,
    status,
    attempts,
    note,
    created_by,
    created_dts,
    modified_by,
    modified_dts;
