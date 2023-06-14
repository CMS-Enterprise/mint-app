WITH QUERIED_IDS AS (
    /*Translate the input to a table */
    SELECT model_plan_id
    FROM
        JSON_TO_RECORDSET(:paramTableJSON)
        AS x("model_plan_id" UUID) --noqa
)

SELECT
    disc.id,
    disc.model_plan_id,
    disc.content,
    disc.role,
    disc.status,
    disc.is_assessment,
    disc.created_by,
    disc.created_dts,
    disc.modified_by,
    disc.modified_dts
FROM QUERIED_IDS AS qIDs
INNER JOIN plan_discussion AS disc ON disc.model_plan_id = qIDs.model_plan_id;
