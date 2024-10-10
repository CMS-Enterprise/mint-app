UPDATE public.user_notification_preferences
SET
    daily_digest_complete = :daily_digest_complete,
    added_as_collaborator = :added_as_collaborator,
    tagged_in_discussion = :tagged_in_discussion,
    tagged_in_discussion_reply = :tagged_in_discussion_reply,
    new_discussion_reply = :new_discussion_reply,
    model_plan_shared = :model_plan_shared,
    new_model_plan = :new_model_plan,
    dates_changed = :dates_changed,
    dates_changed_notification_type = :dates_changed_notification_type,
    data_exchange_approach_marked_complete = :data_exchange_approach_marked_complete,
    data_exchange_approach_marked_complete_notification_type = :data_exchange_approach_marked_complete_notification_type,
    modified_by = :modified_by,
    modified_dts = CURRENT_TIMESTAMP
WHERE
    id = :id
RETURNING
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
data_exchange_approach_marked_complete,
data_exchange_approach_marked_complete_notification_type,
created_by,
created_dts,
modified_by,
modified_dts;
