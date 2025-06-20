SELECT
    mp.id,
    mp.model_name,
    mp.abbreviation,
    mp.status,
    mp.previous_suggested_phase,
    mp.archived,
    mp.created_by,
    mp.created_dts,
    mp.modified_by,
    mp.modified_dts
FROM model_plan AS mp
LEFT JOIN timeline AS tl ON mp.id = tl.model_plan_id
WHERE -- get models that have a clearance start date within 6 months of the current time
    tl.clearance_starts > CURRENT_TIMESTAMP
    AND tl.clearance_starts <= CURRENT_TIMESTAMP + INTERVAL '6 months'
ORDER BY tl.clearance_starts
