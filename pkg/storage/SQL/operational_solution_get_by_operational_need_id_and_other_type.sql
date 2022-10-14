SELECT
    id,
    operational_need_id,
    solution_type,
    archived,
    NULL AS name,
    NULL AS key,
    solution_other,
    poc_name,
    poc_email,
    must_start_dts,
    must_finish_dts,
    status,
    created_by,
    created_dts,
    modified_by,
    modified_dts
FROM operational_solution
WHERE operational_need_id = :operational_need_id AND solution_other = :solution_other;
