INSERT INTO discussion_reply(
    id,
    discussion_id,
    content,
    resolution,
    is_assessment,
    created_by,
    modified_by
)
VALUES (
    :id,
    :discussion_id,
    :content,
    :resolution,
    :is_assessment,
    :created_by,
    :modified_by
)
RETURNING id,
discussion_id,
content,
resolution,
is_assessment,
created_by,
created_dts,
modified_by,
modified_dts;
