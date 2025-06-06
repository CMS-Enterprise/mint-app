WITH retVal AS (
    UPDATE mto_common_solution_contractor
    SET
        mto_common_solution_key = :mto_common_solution_key,
        contractor_title = :contractor_title,
        contractor_name = :contractor_name,
        modified_by = :modified_by,
        modified_dts = CURRENT_TIMESTAMP
    WHERE id = :id
    RETURNING *
)
SELECT * FROM retVal;