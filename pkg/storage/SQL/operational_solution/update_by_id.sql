WITH retVal AS (
    UPDATE operational_solution
    SET
        solution_type = :solution_type,
        name_other = :name_other,
        needed = :needed,
        poc_name = :poc_name,
        poc_email = :poc_email,
        must_start_dts = :must_start_dts,
        must_finish_dts = :must_finish_dts,
        other_header = :other_header,
        status = :status,
        modified_by = :modified_by,
        modified_dts = CURRENT_TIMESTAMP
    WHERE operational_solution.id = :id
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
