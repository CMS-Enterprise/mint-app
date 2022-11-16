SELECT
    id,
    discussion_id,
    content,
    resolution,
    is_assessment,
    created_by,
    created_dts,
    modified_by,
    modified_dts
FROM discussion_reply
INNER JOIN plan_discussion ON plan_discussion.model_plan_id = :model_plan_id
WHERE discussion_reply.created_dts >= :start_date::TIMESTAMP AND discussion_reply.created_dts < :end_date::TIMESTAMP
