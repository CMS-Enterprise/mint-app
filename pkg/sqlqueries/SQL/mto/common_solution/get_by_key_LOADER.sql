WITH QUERIED_IDS AS (
    /*Translate the input to a table */
    SELECT UNNEST(CAST(:keys AS MTO_COMMON_SOLUTION_KEY[]))  AS "key"
)


SELECT
    mto_common_solution.name,
    mto_common_solution.key,
    mto_common_solution.type,
    mto_common_solution.description,
    NULL AS mto_common_milestone_key,
    FALSE AS is_added
FROM mto_common_solution
INNER JOIN QUERIED_IDS AS qIDs ON mto_common_solution.key = qIDs.key
