WITH QUERIED_IDS AS (
    /*Translate the input to a table */
    SELECT possible_operational_solution_id
    FROM
        JSON_TO_RECORDSET(:paramTableJSON)
        AS x("possible_operational_solution_id" int) --noqa
)

SELECT
    posc.id,
    posc.possible_operational_solution_id,
    posc.name,
    posc.email,
    posc.role,
    posc.is_primary,
    posc.created_by,
    posc.created_dts,
    posc.modified_by,
    posc.modified_dts
FROM QUERIED_IDS AS qIDs
INNER JOIN possible_operational_solution_contact AS posc ON posc.possible_operational_solution_id = qIDs.possible_operational_solution_id;
