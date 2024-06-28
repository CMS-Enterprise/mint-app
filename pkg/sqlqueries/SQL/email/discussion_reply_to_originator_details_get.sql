SELECT 

    user_account.common_name,
    user_account.email,
    reply.id,
    reply.discussion_id,
    reply.content,
    reply.user_role,
    reply.user_role_description,
    reply.is_assessment,
    reply.created_dts
FROM 

    discussion_reply AS reply
LEFT JOIN user_account ON user_account.id = reply.created_by

WHERE reply.discussion_id = :disc_id
ORDER BY reply.created_dts DESC --NEWEST TO OLDEST
