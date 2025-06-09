WITH retVal AS (
    DELETE FROM mto_common_solution_contact
    WHERE id = :id
    RETURNING *
)

SELECT * FROM retVal;
