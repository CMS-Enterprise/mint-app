UPDATE public.user_notification
SET 
    is_read = TRUE,
    modified_by = :modified_by,
    modified_dts = CURRENT_TIMESTAMP
WHERE
    id = :id AND user_id = :modified_by
RETURNING
    id,
    activity_id,
    user_id,
    is_read,
    in_app_sent,
    email_sent,
    created_by,
    created_dts,
    modified_by,
    modified_dts;    
