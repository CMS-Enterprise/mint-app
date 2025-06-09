WITH retVal AS (
    DELETE FROM mto_common_solution_contractor
    WHERE id = :id
    RETURNING *
)

SELECT * FROM retVal;
