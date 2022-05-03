SELECT
    id,
    discussion_id,
    content,
    resolution,
    created_by,
    created_dts,
    modified_by,
    modified_dts
FROM discussion_reply
WHERE discussion_id = :discussion_id
