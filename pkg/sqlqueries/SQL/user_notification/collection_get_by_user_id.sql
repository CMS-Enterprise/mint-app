SELECT
    id,
    activity_id,
    user_id,
    is_read,
    is_archived,
    email_sent,
    created_by,
    created_dts,
    modified_by,
    modified_dts
FROM public.user_notification
WHERE user_id = :user_id;
