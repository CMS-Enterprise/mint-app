WITH
  all_models AS (
    -- Users who want to be notified for all model changes and have IN_APP in their dates_changed preferences
    SELECT user_id
    FROM user_notification_preferences
    WHERE dates_changed_notification_type = 'ALL_MODELS'
      AND 'IN_APP' = ANY(dates_changed)
  ),
  followed_models AS (
    -- Users who want to be notified for followed model changes and have IN_APP in their dates_changed preferences
    SELECT f.user_id
    FROM plan_favorite f
           JOIN user_notification_preferences unp ON f.user_id = unp.user_id
    WHERE f.model_plan_id = :model_plan_id
      AND unp.dates_changed_notification_type = 'FOLLOWED_MODELS'
      AND 'IN_APP' = ANY(unp.dates_changed)
  ),
  my_models AS (
    -- Users who want to be notified for models they collaborate on and have IN_APP in their dates_changed preferences
    SELECT c.user_id
    FROM plan_collaborator c
           JOIN user_notification_preferences unp ON c.user_id = unp.user_id
    WHERE c.model_plan_id = :model_plan_id
      AND unp.dates_changed_notification_type = 'MY_MODELS'
      AND 'IN_APP' = ANY(unp.dates_changed)
  )
-- Combine all CTE results, ensuring distinct user IDs, and join with user_account to fetch user details
SELECT DISTINCT ua.id, ua.username, ua.is_euaid, ua.common_name, ua.locale, ua.email, ua.given_name, ua.family_name, ua.zone_info, ua.has_logged_in
FROM (
       SELECT user_id FROM all_models
       UNION ALL
       SELECT user_id FROM followed_models
       UNION ALL
       SELECT user_id FROM my_models
     ) AS combined_users
       JOIN user_account ua ON combined_users.user_id = ua.id;
