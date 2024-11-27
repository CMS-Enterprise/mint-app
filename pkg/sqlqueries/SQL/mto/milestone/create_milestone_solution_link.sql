WITH QUERIED_IDS AS (
    /*Translate the input to a table */
    SELECT
        id,
        milestone_id,
        solution_id,
        created_by,
        created_dts,
        modified_by,
        modified_dts
    FROM
        JSON_TO_RECORDSET(:paramTableJSON) --noqa
)

INSERT INTO mto_milestone_solution_link (
    id,
    milestone_id,
    solution_id,
    created_by,
    created_dts,
    modified_by,
    modified_dts
)
SELECT
    qIDs.id,
    qIDs.milestone_id,
    qIDs.solution_id,
    qIDs.created_by,
    qIDs.created_dts,
    qIDs.modified_by,
    qIDs.modified_dts
FROM QUERIED_IDS AS qIDs;
