WITH QUERIED_IDS AS (
    /*Translate the input to a table */
    SELECT UNNEST(CAST(:mto_common_milestone_ids AS UUID[]))  AS mto_common_milestone_id
)

SELECT
    mto_common_solution.id,
    mto_common_solution.name,
    mto_common_solution.key,
    mto_common_solution.type,
    mto_common_solution.subjects,
    mto_common_solution.filter_view,
    qIDs.mto_common_milestone_id,
    FALSE AS is_added
FROM mto_common_solution
-- Join to the linking table, get all links for the solution
INNER JOIN mto_common_milestone_solution_link ON mto_common_solution.key = mto_common_milestone_solution_link.mto_common_solution_key
-- Join to the QUERIED_IDS CTE to only get solutions linked to a milestone
INNER JOIN QUERIED_IDS AS qIDs ON mto_common_milestone_solution_link.mto_common_milestone_id = qIDs.mto_common_milestone_id;
