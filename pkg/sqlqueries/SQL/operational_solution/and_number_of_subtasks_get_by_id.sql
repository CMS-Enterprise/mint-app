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
    OpSol.is_other,
    OpSol.other_header,
    OpSol.status,
    OpSol.created_by,
    OpSol.created_dts,
    OpSol.modified_by,
    OpSol.modified_dts,
    PNSL.id IS NOT NULL AS is_common_solution, -- A Common Solution is a solution that is linked as a possible solution for an operational need
    (SELECT COUNT(*) FROM operational_solution_subtask WHERE operational_solution_subtask.solution_id = :id) AS number_of_subtasks
FROM operational_solution AS OpSol
LEFT JOIN possible_operational_solution AS pOpSol
    ON OpSol.solution_type = pOpSol.id
LEFT JOIN operational_need ON OpSol.operational_need_id = operational_need.id
LEFT JOIN possible_need_solution_link AS PNSL ON pOpSol.id = PNSL.solution_type AND operational_need.need_type = PNSL.need_type
WHERE OpSol.id = :id;
