WITH QUERIED_IDS AS (
    /* Translate the input UUID array into a table */
    SELECT UNNEST(CAST(:model_plan_ids AS UUID[])) AS model_plan_id
)

SELECT
    task.id,
    task.model_plan_id,
    task.key,
    task.status,
    task.completed_by,
    task.completed_dts,
    task.created_by,
    task.created_dts,
    task.modified_by,
    task.modified_dts
FROM plan_task AS task
INNER JOIN QUERIED_IDS AS qIDs ON task.model_plan_id = qIDs.model_plan_id
ORDER BY task.created_dts DESC;
