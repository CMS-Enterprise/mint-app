SELECT 
    OpSol.id,
    OpSol.operational_need_id,
    OpSol.solution_type,
    COALESCE(pOpSol.full_name, 'Other') AS solution_type_full_name,
    COALESCE(pOpSol.short_name, 'OTHER') AS solution_type_short_name,
    OpSol.solution_other,
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
LEFT JOIN possible_operational_solution AS pOpSol on OpSol.solution_type = pOpSol.id
WHERE OpSol.operational_need_id = :operational_need_id AND pOpSol.short_name = :solution_type;
