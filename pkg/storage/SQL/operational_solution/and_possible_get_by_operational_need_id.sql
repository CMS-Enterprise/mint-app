SELECT
    OpSol.id,
    OpSol.operational_need_id,
    pOpSol.id AS solution_type,
    OpSol.needed AS needed,
    pOpSol.sol_name,
    pOpSol.sol_key,
    OpSol.name_other,
    OpSol.poc_name,
    OpSol.poc_email,
    OpSol.must_start_dts,
    OpSol.must_finish_dts,
    COALESCE(OpSol.status, 'NOT_STARTED') AS status,
    COALESCE(OpNd.created_by, '00000000-0000-0000-0000-000000000000') AS created_by, -- This is UUID.NIL, the same as the UNKNOWN_USER account in the DB
    COALESCE(OpSol.created_dts, CURRENT_TIMESTAMP) AS created_dts,
    OpSol.modified_by,
    OpSol.modified_dts
FROM operational_need AS OpNd
INNER JOIN possible_need_solution_link AS PNSL ON PNSL.need_type = OpNd.need_type
INNER JOIN possible_operational_solution AS pOpSol ON pOpSol.id = PNSL.solution_type
LEFT JOIN operational_solution AS OpSol ON OpSol.solution_type = pOpSol.id AND OpSol.operational_need_id = OpNd.id
WHERE OpNd.id = :operational_need_id AND (:includeNotNeeded = TRUE OR OpSol.needed = TRUE)

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
FROM operational_solution AS OpSol
LEFT JOIN possible_operational_solution AS pOpSol ON OpSol.solution_type = pOpSol.id
WHERE OpSol.operational_need_id = :operational_need_id AND (:includeNotNeeded = TRUE OR OpSol.needed = TRUE)
ORDER BY solution_type ASC;
