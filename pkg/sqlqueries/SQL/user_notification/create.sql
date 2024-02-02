INSERT INTO public.user_notification(
    id,
    activity_id,
    user_id,
    is_read,
    created_by
)
VALUES (
    :id,
    :activity_id,
    :user_id,
    :is_read,
    :created_by
)
RETURNING id,
activity_id,
user_id,
is_read,
created_by,
created_dts,
modified_by,
modified_dts;    
