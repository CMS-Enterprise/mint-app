/* Number of Models Over Time by Creation Date - Cumulative count including both archived and non-archived models */
WITH monthly_counts AS (
SELECT 
    DATE_TRUNC('month', created_dts) AS month_year,
    COUNT(*) AS monthly_models
FROM model_plan 
GROUP BY DATE_TRUNC('month', created_dts)
)
SELECT 
    month_year,
    SUM(monthly_models) OVER (ORDER BY month_year) AS number_of_models
FROM monthly_counts
ORDER BY month_year ASC;
