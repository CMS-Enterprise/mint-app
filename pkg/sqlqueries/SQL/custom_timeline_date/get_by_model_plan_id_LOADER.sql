WITH QUERIED_IDS AS (
    /* Translate the input UUID array into a table */
    SELECT UNNEST(CAST(:model_plan_ids AS UUID[])) AS model_plan_id
)

SELECT
    custom_timeline_date.id,
    custom_timeline_date.model_plan_id,
    custom_timeline_date.title,
    custom_timeline_date.description,
    custom_timeline_date.date_type,
    custom_timeline_date.start_date,
    custom_timeline_date.end_date,
    custom_timeline_date.created_by,
    custom_timeline_date.created_dts,
    custom_timeline_date.modified_by,
    custom_timeline_date.modified_dts
FROM custom_timeline_date
INNER JOIN QUERIED_IDS AS qIDs ON custom_timeline_date.model_plan_id = qIDs.model_plan_id;
