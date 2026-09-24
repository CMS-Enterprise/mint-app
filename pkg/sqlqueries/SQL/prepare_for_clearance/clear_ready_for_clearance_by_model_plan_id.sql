UPDATE plan_basics
SET
    status = 'IN_PROGRESS',
    ready_for_clearance_by = NULL,
    ready_for_clearance_dts = NULL,
    modified_by = :modified_by,
    modified_dts = CURRENT_TIMESTAMP
WHERE
    model_plan_id = :model_plan_id
    AND status = 'READY_FOR_CLEARANCE';

UPDATE plan_general_characteristics
SET
    status = 'IN_PROGRESS',
    ready_for_clearance_by = NULL,
    ready_for_clearance_dts = NULL,
    modified_by = :modified_by,
    modified_dts = CURRENT_TIMESTAMP
WHERE
    model_plan_id = :model_plan_id
    AND status = 'READY_FOR_CLEARANCE';

UPDATE plan_participants_and_providers
SET
    status = 'IN_PROGRESS',
    ready_for_clearance_by = NULL,
    ready_for_clearance_dts = NULL,
    modified_by = :modified_by,
    modified_dts = CURRENT_TIMESTAMP
WHERE
    model_plan_id = :model_plan_id
    AND status = 'READY_FOR_CLEARANCE';

UPDATE plan_beneficiaries
SET
    status = 'IN_PROGRESS',
    ready_for_clearance_by = NULL,
    ready_for_clearance_dts = NULL,
    modified_by = :modified_by,
    modified_dts = CURRENT_TIMESTAMP
WHERE
    model_plan_id = :model_plan_id
    AND status = 'READY_FOR_CLEARANCE';

UPDATE plan_ops_eval_and_learning
SET
    status = 'IN_PROGRESS',
    ready_for_clearance_by = NULL,
    ready_for_clearance_dts = NULL,
    modified_by = :modified_by,
    modified_dts = CURRENT_TIMESTAMP
WHERE
    model_plan_id = :model_plan_id
    AND status = 'READY_FOR_CLEARANCE';

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

UPDATE plan_timeline
SET
    status = 'IN_PROGRESS',
    ready_for_clearance_by = NULL,
    ready_for_clearance_dts = NULL,
    modified_by = :modified_by,
    modified_dts = CURRENT_TIMESTAMP
WHERE
    model_plan_id = :model_plan_id
    AND status = 'READY_FOR_CLEARANCE';
