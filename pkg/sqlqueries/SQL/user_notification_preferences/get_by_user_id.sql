SELECT
    id,
    user_id,
    daily_digest_complete,
    added_as_collaborator,
    tagged_in_discussion,
    tagged_in_discussion_reply,
    new_discussion_reply,
    model_plan_shared,
    new_model_plan,
    dates_changed,
    dates_changed_notification_type,
    created_by,
    created_dts,
    modified_by,
    modified_dts
FROM user_notification_preferences
WHERE user_id = :user_id;
