WITH retVal AS (
INSERT INTO operational_solution(
    id,
    operational_need_id,
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
    created_by
)
SELECT
    :id AS id,
    :operational_need_id AS operational_need_id,
    (SELECT possible_operational_solution.id FROM possible_operational_solution WHERE possible_operational_solution.sol_key = :sol_key) AS solution_type, -- TODO can this be a join?
    :needed AS needed,
    :name_other AS name_other,
    :poc_name AS poc_name,
    :poc_email AS poc_email,
    :must_start_dts AS must_start_dts,
    :must_finish_dts AS must_finish_dts,
    (SELECT possible_operational_solution.treat_as_other FROM possible_operational_solution WHERE possible_operational_solution.sol_key = :sol_key) AS solution_type,
    :other_header AS other_header,
    :status AS status,
    :created_by AS created_by
ON CONFLICT(operational_need_id, solution_type, other_header) DO -- If there is already a record for this, update
UPDATE
SET
    needed = :needed,
    poc_name = :poc_name,
    poc_email = :poc_email,
    must_start_dts = :must_start_dts,
    must_finish_dts = :must_finish_dts,
    other_header = :other_header,
    status = :status,
    modified_by = :modified_by,
    modified_dts = CURRENT_TIMESTAMP
RETURNING
id,
operational_need_id,
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
modified_dts
)

SELECT
    retVal.id,
    retVal.operational_need_id,
    retVal.solution_type,
    pos.sol_name,
    pos.sol_key,
    retVal.needed,
    retVal.name_other,
    retVal.poc_name,
    retVal.poc_email,
    retVal.must_start_dts,
    retVal.must_finish_dts,
    retVal.is_other,
    retVal.other_header,
    retVal.status,
    retVal.created_by,
    retVal.created_dts,
    retVal.modified_by,
    retVal.modified_dts

FROM retVal
LEFT JOIN possible_operational_solution AS pos ON pos.id = retVal.solution_type;
