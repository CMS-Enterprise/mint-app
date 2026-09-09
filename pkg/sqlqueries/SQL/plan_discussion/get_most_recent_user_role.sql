SELECT
    user_role,
    user_role_description
FROM
    (
        SELECT
            user_role,
            user_role_description,
            created_dts
        FROM plan_discussion
        WHERE
            created_by = :user_id
        UNION ALL
        SELECT
            user_role,
            user_role_description,
            created_dts
        FROM discussion_reply
        WHERE
            created_by = :user_id
    ) AS user_roles
ORDER BY created_dts DESC
LIMIT 1;
