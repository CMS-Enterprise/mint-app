/* Include the new column for the possible operational solution */
ALTER TABLE possible_operational_solution
ADD COLUMN treat_as_other BOOLEAN NOT NULL DEFAULT FALSE;


/* Update the possible operational solution table */


WITH SolsToUpdate AS (
    SELECT 'CONTRACTOR' AS key

    UNION
    SELECT 'EXISTING_CMS_DATA_AND_PROCESS' AS KEY

    UNION
    SELECT 'OTHER_NEW_PROCESS' AS key

    UNION
    SELECT 'INTERNAL_STAFF' AS key


    UNION
    SELECT 'CROSS_MODEL_CONTRACT' AS key


)


SELECT * FROM SolsToUpdate
INNER JOIN possible_operational_solution AS pos ON pos.sol_key = SolsToUpdate.key::OPERATIONAL_SOLUTION_KEY
