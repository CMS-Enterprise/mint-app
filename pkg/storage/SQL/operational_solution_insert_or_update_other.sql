INSERT INTO operational_solution(
    id,
    operational_need_id,
    archived,
    name_other,
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
    :archived AS archived,
    :name_other AS name_other,
    :poc_name AS poc_name,
    :poc_email AS poc_email,
    :must_start_dts AS must_start_dts,
    :must_finish_dts AS must_finish_dts,
    :status AS status,
    :created_by AS created_by
ON CONFLICT(operational_need_id, name_other) DO -- If there is already a record for this, update
UPDATE
SET
    archived = :archived,
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
NULL AS name,
NULL AS key,
solution_type,
archived,
name_other,
poc_name,
poc_email,
must_start_dts,
must_finish_dts,
status,
created_by,
created_dts,
modified_by,
modified_dts;
