WITH QUERIED_IDS AS (

    SELECT *
    FROM
        json_to_recordset(:paramTableJSON)
        AS x("operational_need_id" UUID, "include_not_needed" BOOLEAN ) --noqa
),

possibleSolution AS (
    SELECT
        OpSol.id,
        qID.operational_need_id AS operational_need_id,
        pOpSol.id AS solution_type,
        OpSol.needed AS needed,
        pOpSol.sol_name,
        pOpSol.sol_key,
        OpSol.name_other,
        OpSol.poc_name,
        OpSol.poc_email,
        OpSol.must_start_dts,
        OpSol.must_finish_dts,
        coalesce(OpSol.status, 'NOT_STARTED') AS status,
        coalesce(OpSol.created_by, 'NULL') AS created_by,
        coalesce(OpSol.created_dts, current_timestamp) AS created_dts,
        OpSol.modified_by,
        OpSol.modified_dts
    FROM QUERIED_IDS AS qID
    INNER JOIN operational_need AS OpNd ON OpNd.id = qID.operational_need_id
    INNER JOIN possible_need_solution_link AS PNSL ON PNSL.need_type = OpNd.need_type
    INNER JOIN possible_operational_solution AS pOpSol ON pOpSol.id = PNSL.solution_type
    LEFT JOIN operational_solution AS OpSol ON OpSol.solution_type = pOpSol.id AND OpSol.operational_need_id = OpNd.id
    WHERE (qID.include_not_needed = TRUE OR OpSol.needed = TRUE)
)

SELECT * FROM possibleSolution

UNION
SELECT
    OpSol.id,
    OpSol.operational_need_id,
    OpSol.solution_type,
    OpSol.needed,
    pOpSol.sol_name,
    pOpSol.sol_key,
    OpSol.name_other,
    OpSol.poc_name,
    OpSol.poc_email,
    OpSol.must_start_dts,
    OpSol.must_finish_dts,
    OpSol.status,
    OpSol.created_by,
    OpSol.created_dts,
    OpSol.modified_by,
    OpSol.modified_dts

FROM QUERIED_IDS AS qID
INNER JOIN operational_solution AS OpSol ON OpSol.operational_need_id = qID.operational_need_id
LEFT JOIN possible_operational_solution AS pOpSol ON OpSol.solution_type = pOpSol.id
WHERE (qID.include_not_needed = TRUE OR OpSol.needed = TRUE)
ORDER BY solution_type ASC;
