UPDATE plan_payments
SET
    status = 'IN_PROGRESS',
    ready_for_clearance_by = NULL,
    ready_for_clearance_dts = NULL,
    modified_by = :modified_by,
    modified_dts = CURRENT_TIMESTAMP
WHERE
    model_plan_id = :model_plan_id
    AND status = 'READY_FOR_CLEARANCE';
