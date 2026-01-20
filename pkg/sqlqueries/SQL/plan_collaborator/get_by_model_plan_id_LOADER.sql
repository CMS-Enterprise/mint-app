WITH QUERIED_IDS AS (
    /*Translate the input to a table */
    SELECT UNNEST(CAST(:model_plan_ids AS UUID[]))  AS model_plan_id
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
