SELECT
    u.id,
    u.username,
    u.email,
    unp.new_model_plan
FROM user_account AS u
INNER JOIN user_notification_preferences AS unp ON u.id = unp.user_id
WHERE 'IN_APP' = ANY(unp.new_model_plan) OR 'EMAIL' = ANY(unp.new_model_plan);
