SELECT
    plan_discussion.id,
    plan_discussion.model_plan_id,
    plan_discussion.content,
    plan_discussion.user_role,
    plan_discussion.user_role_description,
    plan_discussion.is_assessment,
    plan_discussion.created_by,
    plan_discussion.created_dts,
    plan_discussion.modified_by,
    plan_discussion.modified_dts,
    (SELECT COUNT(*) FROM discussion_reply WHERE discussion_reply.discussion_id = :id AND discussion_reply.created_dts <= :time_to_check) AS number_of_replies
FROM plan_discussion
WHERE plan_discussion.id = :id
