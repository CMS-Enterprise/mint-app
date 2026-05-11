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
        FROM plan_favorite pf
        WHERE
            pf.model_plan_id = qIDs.model_plan_id
            AND pf.user_id = qIDs.user_id
    ) AS is_favorite
FROM QUERIED_IDS qIDs;
