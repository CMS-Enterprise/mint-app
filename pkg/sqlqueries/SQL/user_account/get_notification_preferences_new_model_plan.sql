SELECT
    u.id,
    u.username,
    u.is_euaid,
    u.common_name,
    u.locale,
    u.email,
    u.given_name,
    u.family_name,
    u.zone_info,
    u.has_logged_in,
    unp.new_model_plan AS preference_flags
FROM user_account AS u
INNER JOIN user_notification_preferences AS unp ON u.id = unp.user_id
WHERE CARDINALITY(unp.new_model_plan) > 0;
