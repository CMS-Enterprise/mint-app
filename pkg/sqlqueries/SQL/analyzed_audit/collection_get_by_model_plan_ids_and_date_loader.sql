WITH QUERIED_IDS AS (
    /*Translate the input to a table */
    SELECT DISTINCT -- The JSON could potentially have duplicate date and model plan combinations. This ensures that they are only fetched once per analyzed audit
        date,
        UNNEST(model_plan_ids) AS model_plan_id -- Each row is a combination of date and a model_plan_id
    FROM
        JSON_TO_RECORDSET(:paramTableJSON)
        AS x("date" date, "model_plan_ids" UUID[]) --noqa
)

SELECT
    AA.id,
    AA.model_plan_id,
    AA.model_name,
    AA.date,
    AA.changes,
    AA.created_by,
    AA.created_dts,
    AA.modified_by,
    AA.modified_dts
FROM analyzed_audit AS AA
INNER JOIN QUERIED_IDS AS qIDs  ON AA.date = qIDs.date AND AA.model_plan_id = qIDs.model_plan_id
ORDER BY AA.model_name ASC;
