WITH QUERIED_IDS AS (
    /* Translate the input to a table */
    SELECT UNNEST(CAST(:ids AS UUID[])) AS id
)
SELECT
    contractor.id,
    contractor.mto_common_solution_key,
    contractor.contractor_title,
    contractor.contractor_name,
    contractor.created_by,
    contractor.created_dts,
    contractor.modified_by,
    contractor.modified_dts
FROM QUERIED_IDS AS qIDs
INNER JOIN mto_common_solution_contractor AS contractor
    ON contractor.id = qIDs.id;