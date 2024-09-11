/* Number of Followers By Model */
SELECT
    model_plan.model_name,
    COUNT(favorite.*) AS number_of_followers,
    model_plan.id
FROM model_plan
LEFT JOIN plan_favorite AS favorite ON model_plan.id = favorite.model_plan_id
WHERE  model_plan.archived != TRUE
GROUP BY model_plan.model_name, model_plan.id
ORDER BY number_of_followers DESC
