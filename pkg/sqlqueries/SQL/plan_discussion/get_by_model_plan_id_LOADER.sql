WITH QUERIED_IDS AS (
    /*Translate the input to a table */
    SELECT UNNEST(CAST(:model_plan_ids AS UUID[]))  AS model_plan_id
)

SELECT
    disc.id,
    disc.model_plan_id,
    disc.content,
    disc.user_role,
    disc.user_role_description,
    disc.is_assessment,
    disc.created_by,
    disc.created_dts,
    disc.modified_by,
    disc.modified_dts
FROM  plan_discussion AS disc
INNER JOIN QUERIED_IDS AS qIDs ON disc.model_plan_id = qIDs.model_plan_id
ORDER BY disc.created_dts DESC;
