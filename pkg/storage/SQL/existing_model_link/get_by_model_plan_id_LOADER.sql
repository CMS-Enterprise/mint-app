WITH QUERIED_IDS AS (
    /*Translate the input to a table */
    SELECT model_plan_id
    FROM
        JSON_TO_RECORDSET(:paramTableJSON)
        AS x("model_plan_id" UUID) --noqa
)

SELECT
    link.id,
    link.model_plan_id,
    link.existing_model_id,
    link.current_model_plan_id,
    link.created_by,
    link.created_dts,
    link.modified_by,
    link.modified_dts

FROM QUERIED_IDS AS qIDs
INNER JOIN existing_model_link AS link ON link.model_plan_id = qIDs.model_plan_id;
