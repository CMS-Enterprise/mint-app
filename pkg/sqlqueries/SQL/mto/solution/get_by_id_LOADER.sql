WITH QUERIED_IDS AS (
    /*Translate the input to a table */
    SELECT UNNEST(CAST(:ids AS UUID[]))  AS id
)


SELECT
    mto_solution.id,
    mto_solution.model_plan_id,
    mto_solution.mto_common_solution_key,
    mto_solution.name,
    mto_solution.type,
    mto_solution.facilitated_by,
    mto_solution.status,
    mto_solution.risk_indicator,
    mto_solution.poc_name,
    mto_solution.poc_email,
    mto_solution.created_by,
    mto_solution.created_dts,
    mto_solution.modified_by,
    mto_solution.modified_dts
FROM mto_solution
INNER JOIN QUERIED_IDS AS qIDs ON mto_solution.id = qIDs.id
