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
    (
        SELECT
            :id AS id,
            :operational_need_id AS operational_need_id,
            (SELECT possible_operational_solution.id FROM possible_operational_solution WHERE possible_operational_solution.sol_key = :sol_key) AS solution_type,
            :needed AS needed,
            :name_other AS name_other,
            :poc_name AS poc_name,
            :poc_email AS poc_email,
            :must_start_dts AS must_start_dts,
            :must_finish_dts AS must_finish_dts,
            COALESCE((SELECT possible_operational_solution.treat_as_other FROM possible_operational_solution WHERE possible_operational_solution.sol_key = :sol_key), TRUE) AS is_other, -- IF NULL, then custom
            :other_header AS other_header,
            :status AS status,
            :created_by AS created_by
    )
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
    retVal.modified_dts,
    PNSL.id IS NOT NULL AS is_common_solution -- A Common Solution is a solution that is linked as a possible solution for an operational need

FROM retVal
LEFT JOIN possible_operational_solution AS pos ON pos.id = retVal.solution_type
LEFT JOIN operational_need ON operational_need.id = retVal.operational_need_id
LEFT JOIN possible_need_solution_link AS PNSL ON PNSL.solution_type = pos.id AND PNSL.need_type = operational_need.need_type;
