WITH QUERIED_IDS AS (
    /*Translate the input to a table */
    SELECT model_plan_id
    FROM
        JSON_TO_RECORDSET(:paramTableJSON)
        AS x("model_plan_id" UUID) --noqa
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
FROM QUERIED_IDS AS qIDs
INNER JOIN plan_collaborator AS collab ON collab.model_plan_id = qIDs.model_plan_id;
