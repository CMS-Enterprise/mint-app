WITH
collaborators AS (
    -- Select users who are collaborators on the specific model plan
    SELECT c.user_id
    FROM plan_collaborator AS c
    WHERE
        c.model_plan_id = :model_plan_id
),

followers AS (
    -- Select users who have favorited the specific model plan
    SELECT f.user_id
    FROM plan_favorite AS f
    WHERE
        f.model_plan_id = :model_plan_id
),

combined_users AS (
    -- Combine collaborators and followers, removing duplicates
    SELECT user_id FROM collaborators
    UNION
    SELECT user_id FROM followers
)

-- Join with user_account and user_notification_preferences to fetch user details and preferences
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
    unp.data_exchange_approach_marked_complete AS preference_flags
FROM combined_users
INNER JOIN user_account AS ua ON combined_users.user_id = ua.id
INNER JOIN user_notification_preferences AS unp ON ua.id = unp.user_id
