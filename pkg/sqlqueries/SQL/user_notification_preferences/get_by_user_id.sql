SELECT
    id,
    user_id,
    daily_digest_email,
    daily_digest_in_app,
    new_plan_discussion_email,
    new_plan_discussion_in_app,
    new_discussion_reply_email,
    new_discussion_reply_in_app,
    created_by,
    created_dts,
    modified_by,
    modified_dts
FROM user_notification_preferences
WHERE user_id = :user_id;
