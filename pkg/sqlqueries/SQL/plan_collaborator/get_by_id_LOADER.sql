WITH QUERIED_IDS AS (
    /*Translate the input to a table */
    SELECT id
    FROM
        JSON_TO_RECORDSET(:paramTableJSON)
        AS x("id" UUID) --noqa
)

SELECT
    collab.id,
    collab.model_plan_id,
    collab.user_id,
    collab.team_roles,
    collab.created_by,
    collab.created_dts,
    collab.modified_by,
    collab.modified_dts
FROM plan_collaborator AS collab 
INNER JOIN QUERIED_IDS AS qIDs ON collab.id = qIDs.id;
