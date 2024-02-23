WITH QUERIED_IDS AS (
    /*Translate the input to a table */
    SELECT id
    FROM
        JSON_TO_RECORDSET(:paramTableJSON)
        AS x("id" UUID) --noqa
)

SELECT
    activity.id,
    activity.actor_id,
    activity.entity_id,
    activity.activity_type,
    activity.meta_data,
    activity.created_by,
    activity.created_dts,
    activity.modified_by,
    activity.modified_dts

FROM activity
INNER JOIN QUERIED_IDS AS qIDs  ON activity.id = qIDs.id;
