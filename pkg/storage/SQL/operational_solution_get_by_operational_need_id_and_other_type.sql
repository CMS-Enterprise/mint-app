SELECT
    id,
    operational_need_id,
    solution_type,
    archived,
    'Other' AS solution_type_full_name,
    'OTHER' AS solution_type_short_name,
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
