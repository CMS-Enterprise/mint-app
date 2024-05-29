SELECT u.id,
       u.username,
       u.email,
       unp.new_model_plan
FROM user_account u
       JOIN user_notification_preferences unp ON u.id = unp.user_id
WHERE 'IN_APP' = ANY(unp.new_model_plan) OR 'EMAIL' = ANY(unp.new_model_plan);