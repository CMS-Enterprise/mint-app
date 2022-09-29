INSERT INTO operational_solution(
    id,
    operational_need_id,
    solution_type,
    solution_other,
    poc_name,
    poc_email,
    must_start_dts,
    must_finish_dts,
    status,
    created_by
)
VALUES (
    :id,
    :operational_need_id,
    :solution_type,
    :solution_other,
    :poc_name,
    :poc_email,
    :must_start_dts,
    :must_finish_dts,
    :status,
    :created_by
)
RETURNING id,
operational_need_id,
solution_type,
solution_other,
poc_name,
poc_email,
must_start_dts,
must_finish_dts,
status,
created_by,
created_dts,
modified_by,
modified_dts;
