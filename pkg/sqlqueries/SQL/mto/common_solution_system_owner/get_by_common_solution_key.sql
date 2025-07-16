WITH QUERIED_IDS AS (
    /*Translate the input to a table */
    SELECT UNNEST(CAST(:keys AS MTO_COMMON_SOLUTION_KEY[]))  AS "key"
)

SELECT
    id,
    mto_common_solution_key,
    owner_type,
    cms_component,
    created_by,
    created_dts,
    modified_by,
    modified_dts
FROM QUERIED_IDS AS qIDs
INNER JOIN mto_common_solution_system_owner AS system_owner
    ON system_owner.mto_common_solution_key = qIDs.key;
