/* Models by Status */
SELECT
    status,
    COUNT(*) AS number_of_models
FROM model_plan 
WHERE archived != TRUE
GROUP BY status;
