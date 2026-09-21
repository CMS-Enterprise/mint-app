SELECT DISTINCT pt.model_plan_id
FROM plan_task pt
INNER JOIN plan_timeline t ON t.model_plan_id = pt.model_plan_id
WHERE
    pt.key = 'PREPARE_FOR_CLEARANCE'
    AND pt.state = 'UPCOMING'
    AND t.clearance_starts IS NOT NULL
    AND t.clearance_starts <= :trigger_threshold;
