WITH retVal AS (
    UPDATE operational_solution
    SET solution_type = :solution_type,
        name_other = :name_other,
        archived = :archived,
        poc_name = :poc_name,
        poc_email = :poc_email,
        must_start_dts = :must_start_dts,
        must_finish_dts = :must_finish_dts,
        status = :status,
        modified_by = :modified_by,
        modified_dts = CURRENT_TIMESTAMP
    WHERE operational_solution.id = :id
    RETURNING id,
        operational_need_id,
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
        modified_dts
)

SELECT
    retVal.id,
    retVal.operational_need_id,
    retVal.solution_type,
    pos.sol_name,
    pos.sol_key,
    retVal.archived,
    retVal.name_other,
    retVal.poc_name,
    retVal.poc_email,
    retVal.must_start_dts,
    retVal.must_finish_dts,
    retVal.status,
    retVal.created_by,
    retVal.created_dts,
    retVal.modified_by,
    retVal.modified_dts
FROM retVal
LEFT JOIN possible_operational_solution AS pos ON pos.id = retVal.solution_type;
