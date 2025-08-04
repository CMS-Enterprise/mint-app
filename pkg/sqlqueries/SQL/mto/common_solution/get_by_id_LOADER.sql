WITH QUERIED_IDS AS (
    /*Translate the input to a table */
    SELECT UNNEST(CAST(:ids AS UUID[]))  AS id
)

SELECT
    mto_common_solution.id,
    mto_common_solution.name,
    mto_common_solution.key,
    mto_common_solution.type,
    mto_common_solution.subjects,
    mto_common_solution.filter_view
FROM mto_common_solution
INNER JOIN QUERIED_IDS AS qIDs ON mto_common_solution.id = qIDs.id 
