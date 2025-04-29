WITH QUERIED_IDS AS (
    /* Translate the input to a table */
    SELECT
        is_admin,
        UUID,
        model_plan_id,
        table_names,
        user_id
    FROM
        JSON_TO_RECORDSET(:paramTableJSON)
        AS x("model_plan_id" UUID, "is_admin" BOOLEAN, "user_id" UUID, "table_names" table_name[]) -- noqa
),

KEYS_WITH_ACCESS_CHECK AS (
    SELECT
        qID.*,
        CASE
            WHEN pc.user_id IS NOT NULL THEN TRUE
            ELSE FALSE
        END AS is_collaborator,
        CASE
            WHEN qID.is_admin OR pc.user_id IS NOT NULL THEN TRUE
            ELSE FALSE
        END AS has_restricted_access
    FROM
        QUERIED_IDS qID
    LEFT JOIN plan_collaborator pc
        ON qID.user_id = pc.user_id AND qID.model_plan_id = pc.model_plan_id
)

SELECT * FROM KEYS_WITH_ACCESS_CHECK;
