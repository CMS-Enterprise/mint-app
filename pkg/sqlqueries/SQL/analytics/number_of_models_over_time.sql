/* Number of Models Over Time by Creation Date - Includes both archived and non-archived models */
SELECT 
    DATE_TRUNC('month', created_dts) AS month_year,
    COUNT(*) AS number_of_models
FROM model_plan 
GROUP BY DATE_TRUNC('month', created_dts)
ORDER BY month_year ASC;
