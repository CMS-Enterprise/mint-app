SELECT
    OpSol.id,
    OpSol.operational_need_id,
    pOpSol.id AS solution_type,
    NULL AS needed,
    pOpSol.sol_name,
    pOpSol.sol_key,
    OpSol.name_other,
    OpSol.poc_name,
    OpSol.poc_email,
    OpSol.must_start_dts,
    OpSol.must_finish_dts,
    COALESCE(OpSol.status, 'NOT_STARTED') AS status,
    COALESCE(OpSol.created_by, 'NULL') AS created_by,
    COALESCE(OpSol.created_dts, CURRENT_TIMESTAMP) AS created_dts,
    OpSol.modified_by,
    OpSol.modified_dts
FROM operational_need AS OpNd
INNER JOIN possible_need_solution_link AS PNSL ON PNSL.need_type = OpNd.need_type
INNER JOIN possible_operational_solution AS pOpSol ON pOpSol.id = PNSL.solution_type
LEFT JOIN operational_solution AS OpSol ON OpSol.solution_type = pOpSol.id AND OpSol.operational_need_id = OpNd.id



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
WHERE OpSol.operational_need_id = :operational_need_id
ORDER BY solution_type ASC;
