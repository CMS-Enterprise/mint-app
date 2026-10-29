SELECT
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
    unp.model_follower_update AS preference_flags
FROM plan_favorite AS pf
INNER JOIN user_account AS ua ON pf.user_id = ua.id
INNER JOIN user_notification_preferences AS unp ON ua.id = unp.user_id
WHERE pf.model_plan_id = :model_plan_id
