SELECT
    id,
    model_plan_id,
    model_name,
    date,
    changes,
    created_by,
    created_dts,
    modified_by,
    modified_dts
FROM analyzed_audit
WHERE
    model_plan_id = ANY(:model_plan_ids)
    AND date = :date
ORDER BY model_name ASC
