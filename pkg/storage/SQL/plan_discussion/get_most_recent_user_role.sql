SELECT user_role
FROM
    plan_discussion
WHERE
    (created_by = :user_id AND modified_dts IS NULL)
    OR (modified_by = :user_id AND modified_dts IS NOT NULL)
ORDER BY
    COALESCE(modified_dts, created_dts) DESC
LIMIT 1;
