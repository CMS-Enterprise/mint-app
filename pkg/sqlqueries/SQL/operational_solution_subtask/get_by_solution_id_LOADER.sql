WITH QUERIED_IDS AS (
    /*Translate the input to a table */
    SELECT solution_id
    FROM
        JSON_TO_RECORDSET(:paramTableJSON)
        AS x("solution_id" UUID) --noqa
)

SELECT
    OpSolS.id,
    OpSolS.solution_id,
    OpSolS.name,
    OpSolS.status,
    OpSolS.created_by,
    OpSolS.created_dts,
    OpSolS.modified_by,
    OpSolS.modified_dts
FROM QUERIED_IDS AS qIDs
INNER JOIN operational_solution_subtask AS OpSolS ON OpSolS.solution_id = qIDs.solution_id;
