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
SELECT
    :id AS id,
    :operational_need_id AS operational_need_id,
    possible_operational_solution.id AS solution_type,
    :solution_other AS solution_other,
    :poc_name AS poc_name,
    :poc_email AS poc_email,
    :must_start_dts AS must_start_dts,
    :must_finish_dts AS must_finish_dts,
    :status AS status,
    :created_by AS created_by
FROM possible_operational_solution WHERE possible_operational_solution.short_name = :solution_type_short_name
ON CONFLICT(operational_need_id, solution_type) DO -- If there is already a record for this, update
UPDATE
SET
    solution_other = :solution_other,
    poc_name = :poc_name,
    poc_email = :poc_email,
    must_start_dts = :must_start_dts,
    must_finish_dts = :must_finish_dts,
    status = :status,
    modified_by = :modified_by,
    modified_dts = CURRENT_TIMESTAMP
RETURNING 
id,
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
