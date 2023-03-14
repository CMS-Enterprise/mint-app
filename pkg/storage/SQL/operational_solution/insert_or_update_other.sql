INSERT INTO operational_solution(
    id,
    operational_need_id,
    needed,
    name_other,
    poc_name,
    poc_email,
    must_start_dts,
    must_finish_dts,
    is_other,
    other_header,
    status,
    created_by
)
SELECT
    :id AS id,
    :operational_need_id AS operational_need_id,
    :needed AS needed,
    :name_other AS name_other,
    :poc_name AS poc_name,
    :poc_email AS poc_email,
    :must_start_dts AS must_start_dts,
    :must_finish_dts AS must_finish_dts,
    TRUE AS is_other,
    :other_header AS other_header,
    :status AS status,
    :created_by AS created_by
ON CONFLICT(operational_need_id, name_other, other_header) DO -- If there is already a record for this, update
UPDATE
SET
    needed = :needed,
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
NULL AS sol_name,
NULL AS sol_key,
solution_type,
needed,
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
modified_dts;
