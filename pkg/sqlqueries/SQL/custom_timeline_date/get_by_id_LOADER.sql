WITH QUERIED_IDS AS (
    /* Translate the input UUID array into a table */
    SELECT UNNEST(CAST(:ids AS UUID[])) AS id
)

SELECT
    custom_timeline_dates.id,
    custom_timeline_dates.model_plan_id,
    custom_timeline_dates.title,
    custom_timeline_dates.description,
    custom_timeline_dates.date_type,
    custom_timeline_dates.start_date,
    custom_timeline_dates.end_date,
    custom_timeline_dates.created_by,
    custom_timeline_dates.created_dts,
    custom_timeline_dates.modified_by,
    custom_timeline_dates.modified_dts
FROM custom_timeline_dates
INNER JOIN QUERIED_IDS AS qIDs ON custom_timeline_dates.id = qIDs.id;
