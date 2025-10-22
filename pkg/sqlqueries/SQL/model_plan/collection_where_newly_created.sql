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
WHERE 
    mp.created_dts >= CURRENT_TIMESTAMP - INTERVAL '6 months'
    AND mp.archived = FALSE
ORDER BY mp.created_dts DESC;
