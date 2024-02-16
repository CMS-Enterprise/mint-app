UPDATE public.user_notification_preferences
SET 
    daily_digest_complete = :daily_digest_complete,
    added_as_collaborator = :added_as_collaborator,
    tagged_in_discussion = :tagged_in_discussion,
    tagged_in_discussion_reply = :tagged_in_discussion_reply,
    new_discussion_reply = :new_discussion_reply,
    model_plan_shared = :model_plan_shared,
    new_plan_discussion = :new_plan_discussion,
    modified_by = :modified_by,
    modified_dts = CURRENT_TIMESTAMP
WHERE 
    id = :id AND created_by = :modified_by
RETURNING
id,
user_id,
daily_digest_complete,
added_as_collaborator,
tagged_in_discussion,
tagged_in_discussion_reply,
new_discussion_reply,
model_plan_shared,
new_plan_discussion,
created_by,
created_dts,
modified_by,
modified_dts;    
