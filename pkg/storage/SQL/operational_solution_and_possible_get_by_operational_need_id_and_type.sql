SELECT 
    OpSol.id,
    OpSol.operational_need_id,
    pOpSol.id as solution_type,
    COALESCE(pOpSol.full_name, 'Other') AS solution_type_full_name,
    COALESCE(pOpSol.short_name, 'OTHER') AS solution_type_short_name,
    OpSol.solution_other,
    OpSol.poc_name,
    OpSol.poc_email,
    OpSol.must_start_dts,
    OpSol.must_finish_dts,
    COALESCE(OpSol.status, 'NOT_STARTED') as status,
    COALESCE(OpSol.created_by,'NULL') AS created_by,
    COALESCE(OpSol.created_dts,CURRENT_TIMESTAMP) as created_dts,
    OpSol.modified_by,
    OpSol.modified_dts
FROM operational_need  AS OpNd 
JOIN possible_need_solution_link AS PNSL ON PNSL.need_type = OpNd.need_type
JOIN possible_operational_solution AS pOpSol on pOpSol.id = PNSL.solution_type 
LEFT JOIN operational_solution AS OpSol on OpSol.solution_type = pOpSol.id AND OpSol.operational_need_id = OpNd.id
-- WHERE OpNd.id = '8f8e70db-57e7-4421-99de-4679d4bea3c4' 



UNION
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
WHERE OpSol.operational_need_id = :operational_need_id
ORDER BY solution_type ASC;
