WITH QUERIED_IDS AS (
    /*Translate the input to a table */
    SELECT UNNEST(CAST(:keys AS MTO_COMMON_SOLUTION_KEY[]))  AS "key"
)

SELECT
    id,
    mto_common_solution_key,
    contractor_title,
    contractor_name,
    created_by,
    created_dts,
    modified_by,
    modified_dts
FROM QUERIED_IDS AS qIDs
INNER JOIN mto_common_solution_contractor AS contractor
    ON contractor.mto_common_solution_key = qIDs.key;