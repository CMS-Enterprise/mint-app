WITH QUERIED_IDS AS (
    SELECT UNNEST(CAST(:model_plan_ids AS UUID[])) AS model_plan_id
)

SELECT
    sw.id,
    sw.model_plan_id,
    sw.common_waiver_id,
    sw.created_by,
    sw.created_dts,
    sw.modified_by,
    sw.modified_dts
FROM suggested_waiver AS sw
INNER JOIN QUERIED_IDS ON sw.model_plan_id = QUERIED_IDS.model_plan_id;
