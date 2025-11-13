WITH statuses AS (
    /*Translate the input to a table */
    SELECT UNNEST(CAST(:statuses AS MODEL_PLAN_STATUS[]))  AS status
)

SELECT
    id,
    model_name,
    abbreviation,
    archived,
    model_plan.status,
    previous_suggested_phase,
    created_by,
    created_dts,
    modified_by,
    modified_dts
FROM model_plan
INNER JOIN statuses ON model_plan.status = statuses.status
WHERE model_plan.archived IS FALSE;            
