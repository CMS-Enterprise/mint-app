WITH QUERIED_IDS AS (
    SELECT DISTINCT
        model_plan_id,
        user_id
    FROM
        JSON_TO_RECORDSET(:paramTableJSON)
        AS x("model_plan_id" UUID, "user_id" UUID) -- noqa
)

SELECT
    qIDs.model_plan_id,
    qIDs.user_id,
    EXISTS(
        SELECT 1
        FROM plan_collaborator pc
        WHERE
            pc.model_plan_id = qIDs.model_plan_id
            AND pc.user_id = qIDs.user_id
    ) AS is_collaborator
FROM QUERIED_IDS qIDs;
