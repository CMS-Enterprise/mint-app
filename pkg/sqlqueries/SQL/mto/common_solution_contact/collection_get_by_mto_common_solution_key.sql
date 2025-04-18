WITH QUERIED_IDS AS (
    /*Translate the input to a table */
    SELECT UNNEST(CAST(:keys AS MTO_COMMON_SOLUTION_KEY[]))  AS "key"
)

SELECT
    posc.id,
    posc.mto_common_solution_key,
    posc.name,
    posc.email,
    posc.is_team,
    posc.role,
    posc.is_primary,
    posc.created_by,
    posc.created_dts,
    posc.modified_by,
    posc.modified_dts
FROM QUERIED_IDS AS qIDs
INNER JOIN mto_common_solution_contact AS posc ON posc.mto_common_solution_key = qIDs.key;
