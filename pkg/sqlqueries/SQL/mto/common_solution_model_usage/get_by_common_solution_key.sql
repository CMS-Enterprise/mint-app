WITH QUERIED_IDS AS (
    /*Translate the input to a table */
    SELECT UNNEST(CAST(:keys AS MTO_COMMON_SOLUTION_KEY[]))  AS "key"
)

SELECT
    model_plan.model_name,
    model_plan.abbreviation,
    concat(model_plan.model_name,
        CASE WHEN model_plan.abbreviation IS NOT NULL 
        THEN concat(' (', model_plan.abbreviation, ')')
        ELSE ''
        END) AS model_name,
    model_plan.status,
FROM QUERIED_IDS AS qIDs
INNER JOIN mto_solution ON mto_solution.mto_common_solution_key = qIDs.key
INNER JOIN model_plan ON model_plan.id = mto_solution.model_plan_id;
