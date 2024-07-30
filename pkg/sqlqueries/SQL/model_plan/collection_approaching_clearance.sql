SELECT
    mp.id,
    mp.model_name,
    mp.abbreviation,
    mp.status,
    mp.archived,
    mp.created_by,
    mp.created_dts,
    mp.modified_by,
    mp.modified_dts
FROM model_plan AS mp
LEFT JOIN plan_basics AS basics ON mp.id = basics.model_plan_id 
WHERE -- get models that have a clearance start date within 6 months of the current time
    basics.clearance_starts > CURRENT_TIMESTAMP
    AND basics.clearance_starts <= CURRENT_TIMESTAMP + INTERVAL '6 months'
