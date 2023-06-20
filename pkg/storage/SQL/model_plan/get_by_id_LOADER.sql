WITH QUERIED_IDS AS (
    /*Translate the input to a table */
    SELECT id
    FROM
        JSON_TO_RECORDSET(:paramTableJSON)
        AS x("id" UUID) --noqa
)

SELECT
    plan.id,
    plan.model_name,
    plan.abbreviation,
    plan.archived,
    plan.status,
    plan.created_by,
    plan.created_dts,
    plan.modified_by,
    plan.modified_dts

FROM QUERIED_IDS AS qIDs
INNER JOIN model_plan AS plan ON plan.id = qIDs.id;
