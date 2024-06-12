WITH
all_models AS (
    -- Users who want to be notified for all model changes and have any preference set
    SELECT
        user_id,
        dates_changed
    FROM user_notification_preferences
    WHERE
        dates_changed_notification_type = 'ALL_MODELS'
        AND cardinality(dates_changed) > 0
),

followed_models AS (
    -- Users who want to be notified for followed model changes and have any preference set
    SELECT
        f.user_id,
        unp.dates_changed
    FROM plan_favorite AS f
    INNER JOIN user_notification_preferences AS unp ON f.user_id = unp.user_id
    WHERE
        f.model_plan_id = :model_plan_id
        AND unp.dates_changed_notification_type = 'FOLLOWED_MODELS'
        AND cardinality(unp.dates_changed) > 0
),

my_models AS (
    -- Users who want to be notified for models they collaborate on and have any preference set
    SELECT
        c.user_id,
        unp.dates_changed
    FROM plan_collaborator AS c
    INNER JOIN user_notification_preferences AS unp ON c.user_id = unp.user_id
    WHERE
        c.model_plan_id = :model_plan_id
        AND unp.dates_changed_notification_type = 'MY_MODELS'
        AND cardinality(unp.dates_changed) > 0
)

-- Combine all CTE results, ensuring distinct user IDs, and join with user_account to fetch user details
SELECT DISTINCT
    ua.id,
    ua.username,
    ua.is_euaid,
    ua.common_name,
    ua.locale,
    ua.email,
    ua.given_name,
    ua.family_name,
    ua.zone_info,
    ua.has_logged_in,
    combined_users.dates_changed AS preference_flags -- Alias 'dates_changed' to 'preference_flags'
FROM (
    SELECT
        user_id,
        dates_changed
    FROM all_models
    UNION ALL
    SELECT
        user_id,
        dates_changed
    FROM followed_models
    UNION ALL
    SELECT
        user_id,
        dates_changed
    FROM my_models
) AS combined_users
INNER JOIN user_account AS ua ON combined_users.user_id = ua.id;
