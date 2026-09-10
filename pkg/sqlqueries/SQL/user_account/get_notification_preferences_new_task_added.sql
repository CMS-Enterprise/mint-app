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
    unp.new_task_added AS preference_flags
FROM plan_collaborator AS pc
INNER JOIN user_account AS ua ON pc.user_id = ua.id
INNER JOIN user_notification_preferences AS unp ON ua.id = unp.user_id
WHERE pc.model_plan_id = :model_plan_id
