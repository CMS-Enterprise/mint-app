SELECT
    id,
    operational_need_id,
    solution_type,
    needed,
    NULL AS sol_name,
    NULL AS sol_key,
    name_other,
    poc_name,
    poc_email,
    must_start_dts,
    must_finish_dts,
    is_other,
    other_header,
    status,
    created_by,
    created_dts,
    modified_by,
    modified_dts
FROM operational_solution
WHERE operational_need_id = :operational_need_id AND name_other = :name_other;
