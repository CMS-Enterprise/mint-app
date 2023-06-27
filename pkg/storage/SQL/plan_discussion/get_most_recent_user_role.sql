SELECT user_role
FROM
    (
        SELECT
            user_role,
            COALESCE(modified_dts, created_dts) AS relevant_dts
        FROM plan_discussion
        WHERE
            (created_by = :user_id AND modified_dts IS NULL)
            OR (modified_by = :user_id AND modified_dts IS NOT NULL)
        UNION ALL
        SELECT
            user_role,
            COALESCE(modified_dts, created_dts) AS relevant_dts
        FROM discussion_reply
        WHERE
            (created_by = :user_id AND modified_dts IS NULL)
            OR (modified_by = :user_id AND modified_dts IS NOT NULL)
    ) AS user_roles
ORDER BY relevant_dts DESC
LIMIT 1;
