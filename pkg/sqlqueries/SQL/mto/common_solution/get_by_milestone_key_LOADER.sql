WITH QUERIED_IDS AS (
    /*Translate the input to a table */
    SELECT UNNEST(CAST(:keys AS MTO_COMMON_MILESTONE_KEY[]))  AS "mto_common_milestone_key"
)

SELECT
    mto_common_solution.name,
    mto_common_solution.key,
    mto_common_solution.type,
    mto_common_solution.description,
    qIDs.mto_common_milestone_key,
    NULL AS is_added
FROM mto_common_solution
-- Join to the linking table, get all links for the solution
INNER JOIN mto_common_milestone_solution_link ON mto_common_solution.key = mto_common_milestone_solution_link.mto_common_solution_key
-- Join to the QUERIED_IDS CTE to only get solutions linked to a milestone
INNER JOIN QUERIED_IDS AS qIDs ON mto_common_milestone_solution_link.mto_common_milestone_key = qIDs.mto_common_milestone_key;
