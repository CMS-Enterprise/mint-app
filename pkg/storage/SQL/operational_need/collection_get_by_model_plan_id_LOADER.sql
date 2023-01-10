WITH QUERIED_IDS AS (
    /*Translate the input to a table */
    SELECT model_plan_id
    FROM
        JSON_TO_RECORDSET(:paramTableJSON)
        AS x("model_plan_id" UUID) --noqa
)

SELECT
    OpNd.id,
    OpNd.model_plan_id AS model_plan_id,
    pOpNd.id AS need_type,
    pOpNd.need_name AS need_name,
    pOpNd.need_key AS need_key,
    pOpNd.section AS section,
    OpNd.name_other,
    OpNd.needed AS needed,
    OpNd.created_by AS created_by,
    OpNd.created_dts AS created_dts,
    OpNd.modified_by,
    OpNd.modified_dts
FROM QUERIED_IDS AS qIDs
INNER JOIN operational_need AS OpNd ON OpNd.model_plan_id = qIDs.model_plan_id
LEFT JOIN possible_operational_need AS pOpNd ON OpNd.need_type = pOpNd.id
ORDER BY need_type ASC;
