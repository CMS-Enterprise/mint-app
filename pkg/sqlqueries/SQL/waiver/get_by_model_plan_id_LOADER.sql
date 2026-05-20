WITH QUERIED_IDS AS (
    /*Translate the input to a table */
    SELECT UNNEST(CAST(:model_plan_ids AS UUID[]))  AS model_plan_id
)

SELECT
    w.id,
    w.model_plan_id,
    w.common_waiver_id,
    w.will_use_waiver,
    w.not_using_reason,
    w.created_by,
    w.created_dts,
    w.modified_by,
    w.modified_dts
FROM waiver AS w
INNER JOIN QUERIED_IDS ON w.model_plan_id = QUERIED_IDS.model_plan_id
