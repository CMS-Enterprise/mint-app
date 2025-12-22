WITH QUERIED_IDS AS (
    /* Translate the input to a table */
    SELECT UNNEST(CAST(:ids AS UUID[])) AS id
)

SELECT
    category.id,
    category.name,
    category.created_by,
    category.created_dts,
    category.modified_by,
    category.modified_dts
FROM QUERIED_IDS AS qIDs
INNER JOIN key_contact_category AS category ON category.id = qIDs.id;
