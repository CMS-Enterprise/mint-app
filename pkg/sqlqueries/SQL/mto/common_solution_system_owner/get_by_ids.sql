WITH QUERIED_IDS AS (
    /* Translate the input to a table */
    SELECT UNNEST(CAST(:ids AS UUID[])) AS id
)

SELECT
    system_owner.id,
    system_owner.mto_common_solution_key,
    system_owner.owner_type,
    system_owner.cms_component,
    system_owner.created_by,
    system_owner.created_dts,
    system_owner.modified_by,
    system_owner.modified_dts
FROM QUERIED_IDS AS qIDs
INNER JOIN mto_common_solution_system_owner AS system_owner
    ON system_owner.id = qIDs.id;
